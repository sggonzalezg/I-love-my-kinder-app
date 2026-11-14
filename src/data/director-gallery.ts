import { DIRECTOR_GALLERY_LIMIT } from '@/constants/story';
import { GALLERY_BUCKET } from '@/constants/storage';
import { ALL_ROOMS_KEY, mediaDeletePaths, type DirectorGalleryMedia, type NurseryRoom } from '@/lib/director-gallery';
import type { ShiftName } from '@/lib/shift';
import { groupLabel } from '@/lib/shift';
import { galleryMediaOf, type MediaRow } from './gallery';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface DirectorMediaRow extends MediaRow {
  cover_path: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

export async function fetchNurseryRooms(nurseryId: string): Promise<NurseryRoom[]> {
  return throwOnError<NurseryRoom[]>(await supabase.from('rooms').select('id, name').eq('nursery_id', nurseryId));
}

export async function fetchNurseryMedia(nurseryId: string, roomKey: string): Promise<DirectorGalleryMedia[]> {
  let query = supabase
    .from('media')
    .select('id, file_path, file_type, created_at, uploaded_by, cover_path, rooms(name), shifts(name)')
    .eq('nursery_id', nurseryId);
  if (roomKey !== ALL_ROOMS_KEY) query = query.eq('room_id', roomKey);
  const rows = throwOnError<DirectorMediaRow[]>(await query.order('created_at', { ascending: false }).limit(DIRECTOR_GALLERY_LIMIT));

  const media = await galleryMediaOf(rows);
  return media.map((item, index) => {
    const row = rows[index];
    return {
      ...item,
      groupLabel: row.rooms && row.shifts ? groupLabel(row.rooms.name, row.shifts.name) : (row.rooms?.name ?? ''),
      coverPath: row.cover_path,
    };
  });
}

// Files first, as the panel does: the storage delete policies look the media row up, and a row
// without its file is less harmful than a file nobody can see or delete any more.
export async function deleteNurseryMedia(media: DirectorGalleryMedia): Promise<void> {
  const paths = mediaDeletePaths(media);
  const { data: removed, error: storageError } = await supabase.storage.from(GALLERY_BUCKET).remove(paths);
  if (storageError) throw new Error(storageError.message);
  if (removed?.length !== paths.length) throw new Error(`Removed ${removed?.length ?? 0} of ${paths.length} gallery files`);

  throwOnError(await supabase.from('media').delete().eq('id', media.id));
}
