import { groupTeacher, type DayGroup, type DayRoutine, type GroupTeacher, type PreviousValues } from '@/lib/child-day';
import type { FamilyChild } from '@/lib/room-groups';
import type { HygieneEntry, MealAmount, MealKey } from '@/lib/routine';
import type { ShiftName } from '@/lib/shift';

import { fetchFamilyChildren, fetchRoomRoster } from './family-room';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface ChildDayBase {
  child: FamilyChild;
  openGroups: DayGroup[];
  teachers: Record<string, GroupTeacher | null>;
}

export interface GroupRoutine {
  group: DayGroup;
  routine: DayRoutine;
}

interface ShiftTimesRow {
  id: string;
  start_time: string;
  end_time: string;
}

interface RoutineRow {
  room_id: string;
  shift_id: string;
  meals: Partial<Record<MealKey, MealAmount>> | null;
  rest_start_time: string | null;
  rest_end_time: string | null;
  no_sleep: boolean | null;
  hygiene_entries: HygieneEntry[] | null;
  notes: string | null;
  previous_values: PreviousValues | null;
  created_at: string;
  corrected_at: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName; start_time: string; end_time: string } | null;
}

const ROUTINE_COLUMNS =
  'room_id, shift_id, meals, rest_start_time, rest_end_time, no_sleep, hygiene_entries, notes, previous_values, created_at, corrected_at, rooms(name), shifts(name, start_time, end_time)';

export function groupKeyOf(roomId: string, shiftId: string): string {
  return `${roomId}:${shiftId}`;
}

async function fetchShiftTimes(shiftIds: string[]): Promise<Map<string, ShiftTimesRow>> {
  if (shiftIds.length === 0) return new Map();
  const rows = throwOnError<ShiftTimesRow[]>(await supabase.from('shifts').select('id, start_time, end_time').in('id', shiftIds));
  return new Map(rows.map((row) => [row.id, row]));
}

export async function fetchChildDayBase(userId: string, childId: string): Promise<ChildDayBase | null> {
  const child = (await fetchFamilyChildren(userId)).find((familyChild) => familyChild.id === childId);
  if (!child) return null;

  const shiftTimes = await fetchShiftTimes([...new Set(child.groups.map((group) => group.shiftId))]);
  const openGroups = child.groups.flatMap((group) => {
    const times = shiftTimes.get(group.shiftId);
    return times ? [{ ...group, key: groupKeyOf(group.roomId, group.shiftId), startTime: times.start_time, endTime: times.end_time }] : [];
  });
  const rosters = await Promise.all(openGroups.map((group) => fetchRoomRoster(group)));
  const teachers = Object.fromEntries(openGroups.map((group, index) => [group.key, groupTeacher(rosters[index].teachers)]));
  return { child, openGroups, teachers };
}

export async function fetchDayRoutines(childId: string, isoDate: string): Promise<GroupRoutine[]> {
  const rows = throwOnError<RoutineRow[]>(await supabase.from('routines').select(ROUTINE_COLUMNS).eq('child_id', childId).eq('routine_date', isoDate));
  return rows.flatMap((row) => {
    if (!row.rooms || !row.shifts) return [];
    const group: DayGroup = {
      key: groupKeyOf(row.room_id, row.shift_id),
      roomId: row.room_id,
      roomName: row.rooms.name,
      shiftId: row.shift_id,
      shift: row.shifts.name,
      startTime: row.shifts.start_time,
      endTime: row.shifts.end_time,
    };
    const routine: DayRoutine = {
      roomId: row.room_id,
      shiftId: row.shift_id,
      meals: row.meals ?? {},
      restStart: row.rest_start_time,
      restEnd: row.rest_end_time,
      noSleep: row.no_sleep ?? false,
      hygiene: row.hygiene_entries ?? [],
      notes: row.notes,
      previousValues: row.previous_values ?? {},
      createdAt: row.created_at,
      correctedAt: row.corrected_at,
    };
    return [{ group, routine }];
  });
}
