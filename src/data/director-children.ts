import { AUTHORIZATION_KEYS } from '@/lib/authorizations';
import type { DirectorChildrenInput } from '@/lib/director-children';
import type { CreateChildArgs, NewChildRoom, NewChildShift } from '@/lib/new-child-form';
import type { ShiftName } from '@/lib/shift';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface ChildRow {
  id: string;
  first_name: string;
  last_name: string | null;
  photo_path: string | null;
}

interface EnrollmentRow {
  child_id: string;
  room_id: string;
  ended_at: string | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

interface ConsentRow {
  child_id: string;
  document_type: string;
  accepted: boolean;
  created_at: string;
}

const AUTHORIZATION_DOCUMENT_TYPES = AUTHORIZATION_KEYS.map((key) => CHILD_AUTHORIZATIONS[key].id);

/** RLS returns the director only her nursery's rows, and the per-child authorizations of its children. */
export async function fetchDirectorChildren(nurseryId: string): Promise<DirectorChildrenInput> {
  const [children, enrollments, consents, rooms] = await Promise.all([
    supabase.from('children').select('id, first_name, last_name, photo_path').eq('nursery_id', nurseryId).is('personal_data_deleted_at', null),
    supabase.from('enrollments').select('child_id, room_id, ended_at, rooms(name), shifts(name)').eq('nursery_id', nurseryId),
    supabase.from('consent_records').select('child_id, document_type, accepted, created_at').in('document_type', AUTHORIZATION_DOCUMENT_TYPES).not('child_id', 'is', null),
    supabase.from('rooms').select('id, name').eq('nursery_id', nurseryId),
  ]);

  return {
    children: throwOnError<ChildRow[]>(children).map((row) => ({ id: row.id, firstName: row.first_name, lastName: row.last_name, photoPath: row.photo_path })),
    enrollments: throwOnError<EnrollmentRow[]>(enrollments).flatMap((row) =>
      row.rooms && row.shifts ? [{ childId: row.child_id, roomId: row.room_id, roomName: row.rooms.name, shift: row.shifts.name, endedAt: row.ended_at }] : [],
    ),
    authorizations: throwOnError<ConsentRow[]>(consents).map((row) => ({ childId: row.child_id, documentType: row.document_type, accepted: row.accepted, createdAt: row.created_at })),
    rooms: throwOnError<{ id: string; name: string }[]>(rooms),
  };
}

export interface NewChildChoices {
  rooms: NewChildRoom[];
  shifts: NewChildShift[];
}

export async function fetchNewChildChoices(nurseryId: string): Promise<NewChildChoices> {
  const [rooms, shifts] = await Promise.all([
    supabase.from('rooms').select('id, name').eq('nursery_id', nurseryId),
    supabase.from('shifts').select('id, name').eq('nursery_id', nurseryId),
  ]);
  return { rooms: throwOnError<NewChildRoom[]>(rooms), shifts: throwOnError<NewChildShift[]>(shifts) };
}

/** `create_child` saves the child, the cédula and the enrollment in one transaction; the cédula never stays on the phone. */
export async function createChild(args: CreateChildArgs): Promise<string> {
  return throwOnError<string>(await supabase.rpc('create_child', args));
}
