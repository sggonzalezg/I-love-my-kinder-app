import type { ChildGroup } from '@/lib/room-groups';
import type { SavedRoutine } from '@/lib/routine';
import type { ShiftName } from '@/lib/shift';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface GroupRoutine extends SavedRoutine {
  child_id: string;
  routine_date: string;
  updated_at: string;
}

interface AssignmentRow {
  room_id: string;
  shift_id: string;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

const GROUP_ROUTINE_COLUMNS = 'child_id, routine_date, meals, rest_start_time, rest_end_time, no_sleep, hygiene_entries, notes, updated_at';

export async function fetchTeacherGroups(userId: string): Promise<ChildGroup[]> {
  const rows = throwOnError<AssignmentRow[]>(
    await supabase
      .from('teacher_assignments')
      .select('room_id, shift_id, rooms(name), shifts(name), teachers!inner(user_id)')
      .eq('teachers.user_id', userId)
      .is('ended_at', null),
  );
  return rows.flatMap((row) =>
    row.rooms && row.shifts ? [{ roomId: row.room_id, roomName: row.rooms.name, shiftId: row.shift_id, shift: row.shifts.name }] : [],
  );
}

/** Newest first, so the first routine of a child is her latest one. */
export async function fetchGroupRoutines(group: Pick<ChildGroup, 'roomId' | 'shiftId'>, sinceDate: string): Promise<GroupRoutine[]> {
  return throwOnError<GroupRoutine[]>(
    await supabase
      .from('routines')
      .select(GROUP_ROUTINE_COLUMNS)
      .eq('room_id', group.roomId)
      .eq('shift_id', group.shiftId)
      .gte('routine_date', sinceDate)
      .order('routine_date', { ascending: false }),
  );
}
