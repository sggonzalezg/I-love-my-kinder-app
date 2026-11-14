import { EVENT_TYPES, type EventType } from './calendar';
import { MONTHS_SHORT, WEEKDAYS, WEEKDAYS_SHORT, formatDbTime, fromIsoDate, toIsoDate } from './dates';
import { familiesLabel } from './event-cancellation';
import type { Role } from './role';
import type { ChildGroup } from './room-groups';
import { groupLabel } from './shift';
import { toTimeValue } from './teacher-day';

/** "Salida" needs the permission fields of step 15c, so the form offers it only then. */
export const FORM_EVENT_TYPES: EventType[] = EVENT_TYPES.filter((type) => type !== 'outing');

export const DEFAULT_START_TIME = '09:00';
export const DEFAULT_END_TIME = '10:00';
export const LATEST_EVENT_TIME = '23:59';
export const EVENT_TIME_MINUTE_STEP = 5;
export const EVENT_TITLE_MAX_LENGTH = 120;
export const EVENT_PLACE_MAX_LENGTH = 200;
export const EVENT_DESCRIPTION_MAX_LENGTH = 2000;

export interface EventAudienceOption {
  key: string;
  roomId: string;
  shiftId: string | null;
  label: string;
}

export interface EventFormValues {
  type: EventType | null;
  title: string;
  date: string | null;
  allDay: boolean;
  startTime: string;
  endTime: string;
  untilDate: string | null;
  audienceKey: string | null;
  place: string;
  description: string;
  remindDayBefore: boolean;
}

export interface EventWriteRow {
  title: string;
  event_type: EventType;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  location: string | null;
  description: string | null;
  room_id: string | null;
  shift_id: string | null;
  remind_day_before: boolean;
}

export interface EventChange {
  changed_at?: string;
  previous_values?: { starts_at: string };
}

const BOTH_SHIFTS = 'ambos turnos';

export function audienceKey(roomId: string | null, shiftId: string | null): string {
  return `${roomId ?? ''}:${shiftId ?? ''}`;
}

/** Her groups, then each of her rooms for both shifts (events_insert_teacher allows any event of a room she teaches). */
export function audienceOptions(groups: ChildGroup[]): EventAudienceOption[] {
  const groupOptions = groups.map((group) => ({
    key: audienceKey(group.roomId, group.shiftId),
    roomId: group.roomId,
    shiftId: group.shiftId as string | null,
    label: groupLabel(group.roomName, group.shift),
  }));
  const rooms = new Map(groups.map((group) => [group.roomId, group.roomName]));
  const roomOptions = [...rooms].map(([roomId, roomName]) => ({
    key: audienceKey(roomId, null),
    roomId,
    shiftId: null,
    label: `${roomName} · ${BOTH_SHIFTS}`,
  }));
  return [...groupOptions, ...roomOptions];
}

export function emptyEventForm(defaultAudienceKey: string | null): EventFormValues {
  return {
    type: null,
    title: '',
    date: null,
    allDay: false,
    startTime: DEFAULT_START_TIME,
    endTime: DEFAULT_END_TIME,
    untilDate: null,
    audienceKey: defaultAudienceKey,
    place: '',
    description: '',
    remindDayBefore: true,
  };
}

export function timeError(values: EventFormValues): string | null {
  if (values.allDay || values.endTime >= values.startTime) return null;
  return `Termina antes de empezar. Elegí una hora después de las ${formatDbTime(values.startTime)}.`;
}

export function canSaveEvent(values: EventFormValues): boolean {
  return values.type !== null && values.title.trim() !== '' && values.date !== null && values.audienceKey !== null && timeError(values) === null;
}

function atTime(isoDate: string, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const day = fromIsoDate(isoDate);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours, minutes);
}

function nextMidnight(isoDate: string): Date {
  const day = fromIsoDate(isoDate);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
}

/** An all-day event runs from the local midnight of its first day to the midnight after its last day. */
export function eventInstants(values: EventFormValues): { startsAt: Date; endsAt: Date } {
  const date = values.date!;
  if (values.allDay) return { startsAt: fromIsoDate(date), endsAt: nextMidnight(values.untilDate ?? date) };
  return { startsAt: atTime(date, values.startTime), endsAt: atTime(date, values.endTime) };
}

export function eventWriteRow(values: EventFormValues, audience: Pick<EventAudienceOption, 'roomId' | 'shiftId'>): EventWriteRow {
  const { startsAt, endsAt } = eventInstants(values);
  return {
    title: values.title.trim(),
    event_type: values.type!,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    all_day: values.allDay,
    location: values.place.trim() || null,
    description: values.description.trim() || null,
    room_id: audience.roomId,
    shift_id: audience.shiftId,
    remind_day_before: values.remindDayBefore,
  };
}

export type StoredEventForm = Omit<EventWriteRow, 'event_type'> & { event_type: string; all_day: boolean | null; remind_day_before: boolean | null };

export function formValuesFromRow(row: StoredEventForm): EventFormValues {
  const startsAt = new Date(row.starts_at);
  const endsAt = new Date(row.ends_at);
  const allDay = row.all_day === true;
  const date = toIsoDate(startsAt);
  const lastDay = toIsoDate(new Date(endsAt.getFullYear(), endsAt.getMonth(), endsAt.getDate() - 1));
  return {
    type: FORM_EVENT_TYPES.includes(row.event_type as EventType) ? (row.event_type as EventType) : null,
    title: row.title,
    date,
    allDay,
    startTime: allDay ? DEFAULT_START_TIME : toTimeValue(startsAt),
    endTime: allDay ? DEFAULT_END_TIME : toTimeValue(endsAt),
    untilDate: allDay && lastDay > date ? lastDay : null,
    audienceKey: audienceKey(row.room_id, row.shift_id),
    place: row.location ?? '',
    description: row.description ?? '',
    remindDayBefore: row.remind_day_before !== false,
  };
}

/** F11 shows "Cambió la hora" from these columns for 3 days. */
export function eventChange(previousStartsAt: string, nextStartsAt: string, now: Date): EventChange {
  if (new Date(previousStartsAt).getTime() === new Date(nextStartsAt).getTime()) return {};
  return { changed_at: now.toISOString(), previous_values: { starts_at: previousStartsAt } };
}

export function isFormDirty(initial: EventFormValues, current: EventFormValues): boolean {
  return (Object.keys(initial) as (keyof EventFormValues)[]).some((field) => initial[field] !== current[field]);
}

export function formDayLabel(isoDate: string): string {
  const day = fromIsoDate(isoDate);
  return `${WEEKDAYS[day.getDay()]} ${day.getDate()} ${MONTHS_SHORT[day.getMonth()]}`;
}

export function formShortDayLabel(isoDate: string): string {
  const day = fromIsoDate(isoDate);
  return `${WEEKDAYS_SHORT[day.getDay()]} ${day.getDate()} ${MONTHS_SHORT[day.getMonth()]}`;
}

export function dateSheetDoneLabel(isoDate: string): string {
  const day = fromIsoDate(isoDate);
  return `Listo · ${WEEKDAYS[day.getDay()].toLowerCase()} ${day.getDate()}`;
}

export function notifyFamiliesLine(audienceLabel: string, familyCount: number | null): string {
  return familyCount === null ? `Las familias de ${audienceLabel}` : `${familiesLabel(familyCount)} de ${audienceLabel}`;
}

export function savedEventToast(isEdit: boolean, familyCount: number | null): string {
  if (isEdit) return 'Cambios guardados.';
  return `Evento guardado. Les avisamos a ${familyCount === null ? 'las familias' : familiesLabel(familyCount)}.`;
}

/** The director's form (any audience, every event) comes with step 15e. */
export function canCreateEvents(role: Role): boolean {
  return role === 'teacher';
}

/** Mirrors events_update for a teacher: only her own events; an outing waits for the permission fields of 15c. */
export function canEditEvent(role: Role, isOwnEvent: boolean, type: EventType): boolean {
  return canCreateEvents(role) && isOwnEvent && type !== 'outing';
}
