import { CHAT_PHOTO_MIME_TYPE } from '@/constants/chat';
import { PROFILE_PHOTOS_BUCKET } from '@/constants/storage';
import type { AuthorizationRecord } from '@/lib/authorizations';
import { childPhotoPath } from '@/lib/child-photo';
import { isHealthGranted, type ChildColumns, type DirectorChildFile } from '@/lib/director-child-file';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

import { newChatPhotoId } from './chat-photos';
import { uploadWithProgress } from './storage-upload';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface ChildFileRow {
  id: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
  allergies: string | null;
  photo_path: string | null;
}

/** Null when the child does not read (deleted, or not of the director's nursery). */
export async function fetchDirectorChildFile(childId: string): Promise<DirectorChildFile | null> {
  const [child, healthRecords] = await Promise.all([
    supabase.from('children').select('id, first_name, last_name, birth_date, allergies, photo_path').eq('id', childId).is('personal_data_deleted_at', null).maybeSingle(),
    supabase.from('consent_records').select('document_type, accepted, created_at').eq('child_id', childId).eq('document_type', CHILD_AUTHORIZATIONS.health.id),
  ]);
  const row = throwOnError<ChildFileRow | null>(child);
  if (!row) return null;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    birthDate: row.birth_date,
    allergies: row.allergies,
    photoPath: row.photo_path,
    healthGranted: isHealthGranted(throwOnError<AuthorizationRecord[]>(healthRecords)),
  };
}

/** RLS (`children_update_director`) updates nothing for another nursery, so an empty result is a failure. */
export async function updateChildColumns(childId: string, columns: ChildColumns | { photo_path: string }): Promise<void> {
  const updated = throwOnError<{ id: string }[]>(await supabase.from('children').update(columns).eq('id', childId).select('id'));
  if (!updated.length) throw new Error('child_not_updated');
}

// The child already points at its new photo, so a file left behind only costs storage; it must not fail the change.
async function removeChildPhotoFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(PROFILE_PHOTOS_BUCKET).remove([path]);
  if (error) console.warn('Removing the old child photo failed:', error.message);
}

interface ChildPhotoReplacement {
  nurseryId: string;
  childId: string;
  localUri: string;
  previousPath: string | null;
}

/** Returns the new path once the child points at it. */
export async function replaceChildPhoto({ nurseryId, childId, localUri, previousPath }: ChildPhotoReplacement): Promise<string> {
  const path = childPhotoPath(nurseryId, childId, newChatPhotoId());
  await uploadWithProgress({ bucket: PROFILE_PHOTOS_BUCKET, path, localUri, mimeType: CHAT_PHOTO_MIME_TYPE });
  await updateChildColumns(childId, { photo_path: path });
  if (previousPath) await removeChildPhotoFile(previousPath);
  return path;
}
