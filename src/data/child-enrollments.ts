import { currentEnrollments, type ChildEnrollment, type GroupWrite } from '@/lib/child-enrollments';
import type { ShiftName } from '@/lib/shift';

import { fetchNewChildChoices, type NewChildChoices } from './director-children';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface EnrollmentRow {
  id: string;
  room_id: string;
  shift_id: string;
  ended_at: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

export async function fetchChildEnrollments(childId: string): Promise<ChildEnrollment[]> {
  const rows = throwOnError<EnrollmentRow[]>(
    await supabase.from('enrollments').select('id, room_id, shift_id, ended_at, rooms(name), shifts(name)').eq('child_id', childId),
  );
  const stored = rows.flatMap((row) =>
    row.rooms && row.shifts
      ? [{ id: row.id, roomId: row.room_id, roomName: row.rooms.name, shiftId: row.shift_id, shift: row.shifts.name, endedAt: row.ended_at }]
      : [],
  );
  return currentEnrollments(stored, new Date());
}

export interface GroupFormData extends NewChildChoices {
  enrollments: ChildEnrollment[];
}

export async function fetchGroupFormData(nurseryId: string, childId: string): Promise<GroupFormData> {
  const [choices, enrollments] = await Promise.all([fetchNewChildChoices(nurseryId), fetchChildEnrollments(childId)]);
  return { ...choices, enrollments };
}

/** Throws with the database message, so `enrollmentSaveMessage` can name the refused rule. */
export async function saveGroupWrite(write: GroupWrite): Promise<void> {
  if (write.kind === 'enroll') throwOnError(await supabase.from('enrollments').insert(write.row));
  if (write.kind === 'move') throwOnError(await supabase.rpc('move_children_to_group', write.args));
}
