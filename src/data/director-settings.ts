import {
  changedShifts,
  nurseryDetailsOf,
  nurseryUpdate,
  settingsShifts,
  shiftUpsertRows,
  type NurseryRow,
  type NurserySettings,
  type ShiftRow,
} from '@/lib/director-settings';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

const SHIFT_KEY_COLUMNS = 'nursery_id,name';

export async function fetchNurserySettings(nurseryId: string): Promise<NurserySettings> {
  const [nursery, shifts] = await Promise.all([
    supabase.from('nurseries').select('address, contact_phone, urgent_phone').eq('id', nurseryId).single(),
    supabase.from('shifts').select('name, start_time, end_time').eq('nursery_id', nurseryId),
  ]);
  return { details: nurseryDetailsOf(throwOnError<NurseryRow>(nursery)), shifts: settingsShifts(throwOnError<ShiftRow[]>(shifts)) };
}

/** Only what changed is written; a shift the nursery never had is created by its name, as in the panel W2. */
export async function saveNurserySettings(nurseryId: string, saved: NurserySettings, edited: NurserySettings): Promise<void> {
  const shiftRows = shiftUpsertRows(nurseryId, changedShifts(saved.shifts, edited.shifts));
  const nurseryColumns = nurseryUpdate(saved.details, edited.details);
  const writes = [
    ...(shiftRows.length ? [supabase.from('shifts').upsert(shiftRows, { onConflict: SHIFT_KEY_COLUMNS })] : []),
    ...(Object.keys(nurseryColumns).length ? [supabase.from('nurseries').update(nurseryColumns).eq('id', nurseryId)] : []),
  ];
  (await Promise.all(writes)).forEach((result) => throwOnError(result));
}
