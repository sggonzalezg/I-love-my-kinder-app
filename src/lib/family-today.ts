import { WEEKDAYS, formatTime } from './dates';
import { isNetworkFailure } from './network';
import type { FamilyChild } from './room-groups';
import { groupLabel, type ShiftName } from './shift';

export type KidDayStatus = 'ready' | 'notYet' | 'readOnly';

export interface TodayRoutineKey {
  childId: string;
  roomId: string;
  shiftId: string;
}

export interface NextEventTiming {
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  roomName: string | null;
  shift: ShiftName | null;
}

const NEXT_EVENT_WINDOW_DAYS = 7;
const WHOLE_NURSERY = 'Todo el jardín';
const ALL_DAY = 'Todo el día';

/** A withdrawn child (no open group) is read only; a day is ready once every open group of the child has saved it. */
export function kidDayStatus(child: FamilyChild, todayRoutines: TodayRoutineKey[]): KidDayStatus {
  if (child.groups.length === 0) return 'readOnly';
  const savedForEveryGroup = child.groups.every((group) =>
    todayRoutines.some((routine) => routine.childId === child.id && routine.roomId === group.roomId && routine.shiftId === group.shiftId),
  );
  return savedForEveryGroup ? 'ready' : 'notYet';
}

export function familyGreeting(firstName: string): string {
  return firstName ? `Hola, ${firstName}` : 'Hola';
}

export function eventAudienceLabel(roomName: string | null, shift: ShiftName | null): string {
  if (!roomName) return WHOLE_NURSERY;
  return shift ? groupLabel(roomName, shift) : roomName;
}

export function nextEventLine(event: NextEventTiming): string {
  const startsAt = new Date(event.startsAt);
  const time = event.allDay ? ALL_DAY : `${formatTime(startsAt)} a ${formatTime(new Date(event.endsAt))}`;
  return [WEEKDAYS[startsAt.getDay()], time, eventAudienceLabel(event.roomName, event.shift)].join(' · ');
}

export function nextEventWindowEnd(now: Date): Date {
  const end = new Date(now);
  end.setDate(end.getDate() + NEXT_EVENT_WINDOW_DAYS);
  return end;
}

/** A network failure falls back to the last saved load and says so; any other failure is not hidden. */
export async function loadWithSavedFallback<T>(
  load: () => Promise<T>,
  readSaved: () => Promise<T | null>,
  save: (value: T) => Promise<void>,
): Promise<{ value: T | null; offline: boolean }> {
  try {
    const value = await load();
    await save(value);
    return { value, offline: false };
  } catch (error) {
    if (!isNetworkFailure(error)) throw error;
    return { value: await readSaved(), offline: true };
  }
}
