import type { DirectorRoomRow, DirectorRoomsInput, DirectorShiftRow } from '@/lib/director-rooms';
import type { RoomRow } from '@/lib/room-form';
import type { ShiftName } from '@/lib/shift';

import { fetchRoomRoster, type RoomRoster } from './family-room';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

const INACTIVE_TEACHER_STATUS = 'inactive';

interface EnrollmentRow {
  child_id: string;
  room_id: string;
  shift_id: string;
  children: { first_name: string; birth_date: string | null } | null;
}

interface AssignmentRow {
  teacher_id: string;
  room_id: string;
  shift_id: string;
  teachers: { first_name: string; status: string } | null;
}

export interface DirectorGroupView {
  roomName: string;
  shift: ShiftName;
  roster: RoomRoster;
}

function openFilter(now: Date): string {
  return `ended_at.is.null,ended_at.gt.${now.toISOString()}`;
}

/** RLS returns every row of the nursery to the director. */
export async function fetchDirectorRooms(nurseryId: string, now: Date): Promise<DirectorRoomsInput> {
  const [rooms, shifts, enrollments, assignments] = await Promise.all([
    supabase.from('rooms').select('id, name, description').eq('nursery_id', nurseryId),
    supabase.from('shifts').select('id, name').eq('nursery_id', nurseryId),
    supabase.from('enrollments').select('child_id, room_id, shift_id, children(first_name, birth_date)').eq('nursery_id', nurseryId).or(openFilter(now)),
    supabase.from('teacher_assignments').select('teacher_id, room_id, shift_id, teachers(first_name, status)').eq('nursery_id', nurseryId).or(openFilter(now)),
  ]);

  return {
    rooms: throwOnError<DirectorRoomRow[]>(rooms),
    shifts: throwOnError<DirectorShiftRow[]>(shifts),
    enrollments: throwOnError<EnrollmentRow[]>(enrollments).flatMap((row) =>
      row.children
        ? [{ childId: row.child_id, roomId: row.room_id, shiftId: row.shift_id, firstName: row.children.first_name, birthDate: row.children.birth_date }]
        : [],
    ),
    assignments: throwOnError<AssignmentRow[]>(assignments).flatMap((row) =>
      row.teachers
        ? [{ teacherId: row.teacher_id, roomId: row.room_id, shiftId: row.shift_id, firstName: row.teachers.first_name, isActive: row.teachers.status !== INACTIVE_TEACHER_STATUS }]
        : [],
    ),
  };
}

export async function saveRoom(nurseryId: string, roomId: string | null, row: RoomRow): Promise<void> {
  const rooms = supabase.from('rooms');
  throwOnError(roomId ? await rooms.update(row).eq('id', roomId) : await rooms.insert({ nursery_id: nurseryId, ...row }));
}

export async function fetchDirectorGroupView(roomId: string, shiftId: string): Promise<DirectorGroupView> {
  const [room, shift, roster] = await Promise.all([
    supabase.from('rooms').select('name').eq('id', roomId).single(),
    supabase.from('shifts').select('name').eq('id', shiftId).single(),
    fetchRoomRoster({ roomId, shiftId }),
  ]);
  return {
    roomName: throwOnError<{ name: string }>(room).name,
    shift: throwOnError<{ name: ShiftName }>(shift).name,
    roster,
  };
}
