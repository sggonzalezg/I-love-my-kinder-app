import type { GroupTeacherAssignment, GroupTeacherChanges, NurseryTeacher, TeacherGroup } from '@/lib/group-teachers';
import { groupLabel, type ShiftName } from '@/lib/shift';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

const INACTIVE_TEACHER_STATUS = 'inactive';

interface TeacherRow {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
}

interface AssignmentRow {
  teacher_id: string;
  room_id: string;
  shift_id: string;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

export interface GroupTeachersInput {
  teachers: NurseryTeacher[];
  assignments: GroupTeacherAssignment[];
}

export async function fetchGroupTeachersInput(nurseryId: string): Promise<GroupTeachersInput> {
  const [teachers, assignments] = await Promise.all([
    supabase.from('teachers').select('id, first_name, last_name, status').eq('nursery_id', nurseryId),
    supabase.from('teacher_assignments').select('teacher_id, room_id, shift_id, rooms(name), shifts(name)').eq('nursery_id', nurseryId).is('ended_at', null),
  ]);

  return {
    teachers: throwOnError<TeacherRow[]>(teachers).map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      isActive: row.status !== INACTIVE_TEACHER_STATUS,
    })),
    assignments: throwOnError<AssignmentRow[]>(assignments).flatMap((row) =>
      row.rooms && row.shifts
        ? [{ teacherId: row.teacher_id, roomId: row.room_id, shiftId: row.shift_id, groupLabel: groupLabel(row.rooms.name, row.shifts.name) }]
        : [],
    ),
  };
}

/** As the panel W12: a removed teacher's assignment is closed (her history in the group stays) before the added ones go in, so a retry repeats nothing. */
export async function saveGroupTeachers(nurseryId: string, group: TeacherGroup, changes: GroupTeacherChanges): Promise<void> {
  if (changes.removed.length) {
    throwOnError(
      await supabase
        .from('teacher_assignments')
        .update({ ended_at: new Date().toISOString() })
        .in('teacher_id', changes.removed)
        .eq('room_id', group.roomId)
        .eq('shift_id', group.shiftId)
        .is('ended_at', null),
    );
  }
  if (!changes.added.length) return;
  throwOnError(
    await supabase
      .from('teacher_assignments')
      .insert(changes.added.map((teacherId) => ({ nursery_id: nurseryId, teacher_id: teacherId, room_id: group.roomId, shift_id: group.shiftId }))),
  );
}
