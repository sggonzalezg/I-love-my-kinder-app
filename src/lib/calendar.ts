import { MONTHS, formatTime, fromIsoDate, toIsoDate } from './dates';
import { eventAudienceLabel } from './family-today';
import type { ShiftName } from './shift';
import { uploaderLabel } from './story';

export type EventType = 'workshop' | 'meeting' | 'outing' | 'celebration' | 'no_classes' | 'other';

export const EVENT_TYPES: EventType[] = ['workshop', 'meeting', 'outing', 'celebration', 'no_classes', 'other'];

const EVENT_LABELS: Record<EventType, string> = {
  workshop: 'Taller',
  meeting: 'Reunión',
  outing: 'Salida',
  celebration: 'Fiesta o acto',
  no_classes: 'Sin clases',
  other: 'Otro',
};

/** An event as the calendar shows it: `date` is the local day (YYYY-MM-DD), times are local ("9:30"). */
export interface Event {
  id: string;
  type: EventType;
  title: string;
  date: string;
  time_start?: string;
  time_end?: string;
  place?: string;
  description?: string;
  image_url?: string;
  audience: string;
  author_line?: string;
  reminder_at?: string;
  changed_previous_time?: string;
}

export interface EventRow {
  id: string;
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean | null;
  location: string | null;
  description: string | null;
  remind_day_before: boolean | null;
  changed_at: string | null;
  previous_values: { starts_at?: string } | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

export interface EventExtras {
  imageUrl: string | null;
  authorLine: string | null;
}

export type MonthPeriod = 'past' | 'current' | 'future';

const REMINDER_HOUR = 18;
const RECENT_CHANGE_DAYS = 3;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const OWN_EVENT_AUTHOR_LINE = 'Lo agendaste vos';

export function eventTypeLabel(type: string): string {
  return EVENT_LABELS[type as EventType] ?? 'Otro';
}

function eventType(type: string): EventType {
  return type in EVENT_LABELS ? (type as EventType) : 'other';
}

/** Design F11: the nursery reminds the day before at 18:00, so there is nothing to remind once the event started. */
function reminderAt(startsAt: Date, remindDayBefore: boolean | null, now: Date): string | undefined {
  if (remindDayBefore === false || startsAt <= now) return undefined;
  const reminder = new Date(startsAt.getFullYear(), startsAt.getMonth(), startsAt.getDate() - 1, REMINDER_HOUR);
  return reminder.toISOString();
}

/** Design F11: what changed shows for 3 days after the change. */
function recentPreviousTime(row: EventRow, now: Date): string | undefined {
  const previousStart = row.previous_values?.starts_at;
  if (!row.changed_at || !previousStart) return undefined;
  const isRecent = now.getTime() - new Date(row.changed_at).getTime() < RECENT_CHANGE_DAYS * MILLISECONDS_PER_DAY;
  return isRecent ? formatTime(new Date(previousStart)) : undefined;
}

export function eventFromRow(row: EventRow, { imageUrl, authorLine }: EventExtras, now: Date): Event {
  const startsAt = new Date(row.starts_at);
  const isAllDay = row.all_day === true;
  return {
    id: row.id,
    type: eventType(row.event_type),
    title: row.title,
    date: toIsoDate(startsAt),
    time_start: isAllDay ? undefined : formatTime(startsAt),
    time_end: isAllDay ? undefined : formatTime(new Date(row.ends_at)),
    place: row.location ?? undefined,
    description: row.description ?? undefined,
    image_url: imageUrl ?? undefined,
    audience: eventAudienceLabel(row.rooms?.name ?? null, row.shifts?.name ?? null),
    author_line: authorLine ?? undefined,
    reminder_at: reminderAt(startsAt, row.remind_day_before, now),
    changed_previous_time: recentPreviousTime(row, now),
  };
}

export function eventAuthorLine(isOwnEvent: boolean, author: { role: string; firstName: string } | null): string | null {
  if (isOwnEvent) return OWN_EVENT_AUTHOR_LINE;
  return author ? `Lo agendó ${uploaderLabel(author)}` : null;
}

export function markedDays(events: Event[], year: number, month: number): { withEvents: Set<number>; noClasses: Set<number> } {
  const withEvents = new Set<number>();
  const noClasses = new Set<number>();
  for (const event of events) {
    const day = fromIsoDate(event.date);
    if (day.getFullYear() !== year || day.getMonth() !== month) continue;
    (event.type === 'no_classes' ? noClasses : withEvents).add(day.getDate());
  }
  return { withEvents, noClasses };
}

function startMinutes(event: Event): number {
  if (!event.time_start) return -1;
  const [hours, minutes] = event.time_start.split(':').map(Number);
  return hours * 60 + minutes;
}

export function eventsOnDate(events: Event[], isoDate: string): Event[] {
  return events.filter((event) => event.date === isoDate).sort((first, second) => startMinutes(first) - startMinutes(second));
}

function byStart(first: Event, second: Event): number {
  return first.date.localeCompare(second.date) || startMinutes(first) - startMinutes(second);
}

export function upcomingFrom(events: Event[], todayIso: string): Event[] {
  return events.filter((event) => event.date >= todayIso).sort(byStart);
}

export function pastBefore(events: Event[], todayIso: string): Event[] {
  return events.filter((event) => event.date < todayIso).sort((first, second) => byStart(second, first));
}

export function monthPeriod(year: number, month: number, today: Date): MonthPeriod {
  const shown = year * 12 + month;
  const current = today.getFullYear() * 12 + today.getMonth();
  if (shown === current) return 'current';
  return shown < current ? 'past' : 'future';
}

export function monthBounds(year: number, month: number): { start: Date; end: Date } {
  return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) };
}

export interface CalendarListInput {
  year: number;
  month: number;
  selectedDay: number | null;
  pastShown: boolean;
  monthEvents: Event[];
  upcomingEvents: Event[];
  today: Date;
}

export type CalendarListKind = 'day' | 'upcoming' | 'past';

/** Design F10: the current month lists what comes from today on (into next months) and offers its past events. */
export function calendarList({ year, month, selectedDay, pastShown, monthEvents, upcomingEvents, today }: CalendarListInput): {
  kind: CalendarListKind;
  events: Event[];
  pastCount: number;
} {
  const todayIso = toIsoDate(today);
  if (selectedDay !== null) return { kind: 'day', events: eventsOnDate(monthEvents, toIsoDate(new Date(year, month, selectedDay))), pastCount: 0 };
  const period = monthPeriod(year, month, today);
  if (period === 'past' || pastShown) return { kind: 'past', events: pastBefore(monthEvents, todayIso), pastCount: 0 };
  if (period === 'future') return { kind: 'upcoming', events: upcomingFrom(monthEvents, todayIso), pastCount: 0 };
  return { kind: 'upcoming', events: upcomingFrom(upcomingEvents, todayIso), pastCount: pastBefore(monthEvents, todayIso).length };
}

/** Weeks of a month, Monday first; empty cells are null. `month` is 0-based. */
export function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function monthTitle(year: number, month: number): string {
  const name = MONTHS[month];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
