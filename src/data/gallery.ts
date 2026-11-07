import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { GALLERY_BUCKET } from '@/constants/storage';
import type { GalleryChild, GalleryGroup, GalleryMedia } from '@/lib/gallery';
import type { ShiftName } from '@/lib/shift';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface EnrollmentRow {
  room_id: string;
  shift_id: string;
  started_at: string;
  ended_at: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

interface ChildLinkRow {
  children: { id: string; first_name: string; enrollments: EnrollmentRow[] } | null;
}

interface MediaRow {
  id: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export async function fetchFamilyGalleryChildren(userId: string): Promise<GalleryChild[]> {
  const rows = throwOnError<ChildLinkRow[]>(
    await supabase
      .from('family_member_children')
      .select('children(id, first_name, enrollments(room_id, shift_id, started_at, ended_at, rooms(name), shifts(name))), family_members!inner(user_id)')
      .eq('family_members.user_id', userId),
  );

  return rows.flatMap(({ children: child }) =>
    child
      ? [
          {
            id: child.id,
            firstName: child.first_name,
            enrollments: child.enrollments.flatMap((enrollment) =>
              enrollment.rooms && enrollment.shifts
                ? [
                    {
                      roomId: enrollment.room_id,
                      roomName: enrollment.rooms.name,
                      shiftId: enrollment.shift_id,
                      shift: enrollment.shifts.name,
                      startedAt: enrollment.started_at,
                      endedAt: enrollment.ended_at,
                    },
                  ]
                : [],
            ),
          },
        ]
      : [],
  );
}

// RLS keeps a family to what was posted while one of its children was in the group.
export async function fetchGroupMedia(group: GalleryGroup): Promise<GalleryMedia[]> {
  const rows = throwOnError<MediaRow[]>(
    await supabase
      .from('media')
      .select('id, file_path, file_type, created_at')
      .eq('room_id', group.roomId)
      .eq('shift_id', group.shiftId)
      .order('created_at', { ascending: false }),
  );
  if (rows.length === 0) return [];

  const { data: signed, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .createSignedUrls(rows.map((row) => row.file_path), SIGNED_URL_EXPIRY_SECONDS);
  if (error) throw new Error(error.message);
  const urlByPath = new Map((signed ?? []).map((entry) => [entry.path, entry.signedUrl]));

  return rows.map((row) => ({
    id: row.id,
    type: row.file_type === 'video' ? 'video' : 'photo',
    createdAt: row.created_at,
    url: urlByPath.get(row.file_path) ?? null,
  }));
}
