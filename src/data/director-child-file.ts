import type { AuthorizationRecord } from '@/lib/authorizations';
import { isHealthGranted, type ChildColumns, type DirectorChildFile } from '@/lib/director-child-file';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

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
export async function updateChildColumns(childId: string, columns: ChildColumns): Promise<void> {
  const updated = throwOnError<{ id: string }[]>(await supabase.from('children').update(columns).eq('id', childId).select('id'));
  if (!updated.length) throw new Error('child_not_updated');
}
