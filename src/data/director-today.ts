import { toIsoDate } from '@/lib/dates';
import { supervisionGroups, type EnrolledChild, type GroupKeyRef, type SupervisionGroup, type TodayRoutineRef } from '@/lib/director-today';
import type { ShiftName } from '@/lib/shift';

import { openAtFilter } from './nursery-audience';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface EnrollmentRow {
  child_id: string;
  room_id: string;
  shift_id: string;
  children: { first_name: string; last_name: string | null } | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName; start_time: string } | null;
}

interface GroupRow {
  room_id: string;
  shift_id: string;
}

interface RoutineRow extends GroupRow {
  child_id: string;
}

async function fetchEnrolledChildren(nurseryId: string, now: Date): Promise<EnrolledChild[]> {
  const rows = throwOnError<EnrollmentRow[]>(
    await supabase
      .from('enrollments')
      .select('child_id, room_id, shift_id, children(first_name, last_name), rooms(name), shifts(name, start_time)')
      .eq('nursery_id', nurseryId)
      .or(openAtFilter(now)),
  );
  return rows.flatMap((row) =>
    row.children && row.rooms && row.shifts
      ? [
          {
            childId: row.child_id,
            name: [row.children.first_name, row.children.last_name].filter(Boolean).join(' '),
            roomId: row.room_id,
            roomName: row.rooms.name,
            shiftId: row.shift_id,
            shift: row.shifts.name,
            shiftStartTime: row.shifts.start_time,
          },
        ]
      : [],
  );
}

async function fetchStaffedGroups(nurseryId: string, now: Date): Promise<GroupKeyRef[]> {
  const rows = throwOnError<GroupRow[]>(await supabase.from('teacher_assignments').select('room_id, shift_id').eq('nursery_id', nurseryId).or(openAtFilter(now)));
  return rows.map((row) => ({ roomId: row.room_id, shiftId: row.shift_id }));
}

async function fetchTodayRoutines(roomIds: string[], today: Date): Promise<TodayRoutineRef[]> {
  if (roomIds.length === 0) return [];
  const rows = throwOnError<RoutineRow[]>(
    await supabase.from('routines').select('child_id, room_id, shift_id').in('room_id', roomIds).eq('routine_date', toIsoDate(today)),
  );
  return rows.map((row) => ({ childId: row.child_id, roomId: row.room_id, shiftId: row.shift_id }));
}

export async function fetchSupervision(nurseryId: string, now: Date): Promise<SupervisionGroup[]> {
  const [enrolled, staffed] = await Promise.all([fetchEnrolledChildren(nurseryId, now), fetchStaffedGroups(nurseryId, now)]);
  const roomIds = [...new Set(enrolled.map((enrollment) => enrollment.roomId))];
  const routines = await fetchTodayRoutines(roomIds, now);
  return supervisionGroups(enrolled, staffed, routines, now);
}
