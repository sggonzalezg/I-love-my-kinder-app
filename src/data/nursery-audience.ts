import type { AudienceMember, NurseryAudience } from '@/lib/director-event-audience';
import type { ShiftName } from '@/lib/shift';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

type MemberColumn = 'child_id' | 'teacher_id';

type GroupMemberRow = Record<MemberColumn, string> & {
  room_id: string;
  shift_id: string;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
};

const GROUP_COLUMNS = 'room_id, shift_id, rooms(name), shifts(name)';

/** An assignment or enrollment is open until ended_at passes. */
export function openAtFilter(now: Date): string {
  return `ended_at.is.null,ended_at.gt.${now.toISOString()}`;
}

/** RLS returns every row of the nursery only to the director. */
async function fetchOpenMembers(table: 'enrollments' | 'teacher_assignments', memberColumn: MemberColumn, nurseryId: string, now: Date): Promise<AudienceMember[]> {
  const rows = throwOnError<GroupMemberRow[]>(
    await supabase.from(table).select(`${memberColumn}, ${GROUP_COLUMNS}`).eq('nursery_id', nurseryId).or(openAtFilter(now)),
  );
  return rows.flatMap((row) =>
    row.rooms && row.shifts
      ? [{ memberId: row[memberColumn], roomId: row.room_id, roomName: row.rooms.name, shiftId: row.shift_id, shift: row.shifts.name }]
      : [],
  );
}

export async function fetchNurseryAudience(nurseryId: string, now: Date): Promise<NurseryAudience> {
  const [children, teachers] = await Promise.all([
    fetchOpenMembers('enrollments', 'child_id', nurseryId, now),
    fetchOpenMembers('teacher_assignments', 'teacher_id', nurseryId, now),
  ]);
  return { children, teachers };
}
