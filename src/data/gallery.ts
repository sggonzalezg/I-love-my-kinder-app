import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { GALLERY_BUCKET } from '@/constants/storage';
import { initials } from '@/lib/format';
import type { GalleryChild, GalleryGroup, GalleryMedia, MediaUploader } from '@/lib/gallery';
import type { ShiftName } from '@/lib/shift';
import { uploaderLabel } from '@/lib/story';
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
  uploaded_by: string;
}

interface UploaderRow {
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
  photo_path: string | null;
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
      .select('id, file_path, file_type, created_at, uploaded_by')
      .eq('room_id', group.roomId)
      .eq('shift_id', group.shiftId)
      .order('created_at', { ascending: false }),
  );
  if (rows.length === 0) return [];

  const [{ data: signed, error }, uploaders] = await Promise.all([
    supabase.storage.from(GALLERY_BUCKET).createSignedUrls(rows.map((row) => row.file_path), SIGNED_URL_EXPIRY_SECONDS),
    fetchUploaders([...new Set(rows.map((row) => row.uploaded_by))]),
  ]);
  if (error) throw new Error(error.message);
  const urlByPath = new Map((signed ?? []).map((entry) => [entry.path, entry.signedUrl]));

  return rows.map((row) => ({
    id: row.id,
    type: row.file_type === 'video' ? 'video' : 'photo',
    createdAt: row.created_at,
    url: urlByPath.get(row.file_path) ?? null,
    filePath: row.file_path,
    uploader: uploaders.get(row.uploaded_by) ?? null,
  }));
}

// RLS hides teachers who left the nursery, so their media shows no uploader.
async function fetchUploaders(userIds: string[]): Promise<Map<string, MediaUploader>> {
  const rows = throwOnError<UploaderRow[]>(
    await supabase.from('teachers').select('user_id, first_name, last_name, role, photo_path').in('user_id', userIds),
  );
  return new Map(
    rows.map((row) => [
      row.user_id,
      { label: uploaderLabel({ role: row.role, firstName: row.first_name }), initials: initials(row.first_name, row.last_name), photoPath: row.photo_path },
    ]),
  );
}
