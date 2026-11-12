import { formatTime, WEEKDAYS } from './dates';
import type { HygieneKind } from './routine';
import type { ChildSyncStatus } from './routine-queue';
import { currentShift, type ShiftName } from './shift';

export type TimeField = 'hour' | 'minute';

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

export function readyCount(statuses: ChildSyncStatus[]): number {
  return statuses.filter((status) => status === 'synced' || status === 'pending').length;
}

export function firstToLogIndex(statuses: ChildSyncStatus[]): number {
  return Math.max(statuses.indexOf('none'), 0);
}

export function logButtonLabel(ready: number): string {
  return ready === 0 ? 'Registrar el día' : 'Seguir registrando';
}

export function dayHeaderDate(day: Date): string {
  return `${WEEKDAYS[day.getDay()]} ${day.getDate()}`;
}

export function defaultGroupIndex(groups: { shift: ShiftName }[], now: Date): number {
  return Math.max(
    groups.findIndex((group) => group.shift === currentShift(now)),
    0,
  );
}

export interface GroupSummary {
  childCount: number;
  readyCount: number;
  /** As the backend stores it, "13:00:00". */
  shiftStartTime: string;
}

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function roomSwitchMeta({ childCount, readyCount: ready, shiftStartTime }: GroupSummary, now: Date): string {
  const children = countLabel(childCount, 'niño', 'niños');
  const startTime = shiftStartTime.slice(0, 'HH:MM'.length);
  return isFutureTime(startTime, now) ? `${children} · empieza ${startTime}` : `${children} · ${countLabel(ready, 'listo', 'listos')}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

function fromMinutes(total: number): string {
  return `${pad(Math.floor(total / MINUTES_PER_HOUR))}:${pad(total % MINUTES_PER_HOUR)}`;
}

export function toTimeValue(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function minutesBefore(now: Date, minutes: number): string {
  return fromMinutes(Math.max(toMinutes(toTimeValue(now)) - minutes, 0));
}

export function isFutureTime(time: string, now: Date): boolean {
  return toMinutes(time) > toMinutes(toTimeValue(now));
}

/** One step of the hour or minute column; the minute wraps inside its hour, and a step past now is ignored. */
export function stepTime(time: string, field: TimeField, delta: number, now: Date): string {
  const [hours, minutes] = time.split(':').map(Number);
  const next =
    field === 'hour'
      ? `${pad((hours + delta + HOURS_PER_DAY) % HOURS_PER_DAY)}:${pad(minutes)}`
      : `${pad(hours)}:${pad((minutes + delta + MINUTES_PER_HOUR) % MINUTES_PER_HOUR)}`;
  return isFutureTime(next, now) ? time : next;
}

export function hygieneSheetCopy(kind: HygieneKind, time: string): { title: string; add: string } {
  return kind === 'diaper'
    ? { title: '¿A qué hora fue el cambio?', add: `Agregar cambio a las ${time}` }
    : { title: '¿A qué hora fue al baño?', add: `Agregar a las ${time}` };
}

export function syncedLabel(savedAt: string): string {
  return `Cargado a las ${formatTime(new Date(savedAt))}`;
}
