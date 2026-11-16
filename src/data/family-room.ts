import type { ChildGroup, FamilyChild } from '@/lib/room-groups';
import type { ShiftName } from '@/lib/shift';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface RosterChild {
  id: string;
  display_name: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  photo_path: string | null;
  allergies: string | null;
}

export interface RosterTeacher {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  photo_path: string | null;
}

export interface RoomRoster {
  children: RosterChild[];
  teachers: RosterTeacher[];
}

interface EnrollmentRow {
  room_id: string;
  shift_id: string;
  ended_at: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

interface ChildLinkRow {
  children: { id: string; first_name: string; last_name: string; photo_path: string | null; enrollments: EnrollmentRow[] } | null;
}

export async function fetchFamilyChildren(userId: string): Promise<FamilyChild[]> {
  const rows = throwOnError<ChildLinkRow[]>(
    await supabase
      .from('family_member_children')
      .select('children(id, first_name, last_name, photo_path, enrollments(room_id, shift_id, ended_at, rooms(name), shifts(name))), family_members!inner(user_id)')
      .eq('family_members.user_id', userId),
  );

  return rows.flatMap(({ children: child }) =>
    child
      ? [
          {
            id: child.id,
            firstName: child.first_name,
            lastName: child.last_name,
            photoPath: child.photo_path,
            groups: child.enrollments
              .filter((enrollment) => !enrollment.ended_at && enrollment.rooms && enrollment.shifts)
              .map((enrollment) => ({
                roomId: enrollment.room_id,
                roomName: enrollment.rooms!.name,
                shiftId: enrollment.shift_id,
                shift: enrollment.shifts!.name,
              })),
          },
        ]
      : [],
  );
}

export async function fetchRoomRoster(group: Pick<ChildGroup, 'roomId' | 'shiftId'>): Promise<RoomRoster> {
  const roster = throwOnError<{ children: RosterChild[] | null; teachers: RosterTeacher[] | null }>(
    await supabase.rpc('get_room_roster', { room_id: group.roomId, shift_id: group.shiftId }),
  );
  return { children: roster.children ?? [], teachers: roster.teachers ?? [] };
}
