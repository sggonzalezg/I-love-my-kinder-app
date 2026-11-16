import type { ChildContact, ChildPeople, ChildPerson, PersonKind, PersonRow, PickupPerson } from '@/lib/child-people';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

const PERSON_TABLES: Record<PersonKind, string> = { contact: 'emergency_contacts', pickup: 'pickup_people' };
const CONTACT_COLUMNS = 'id, name, relationship, phone';
const PERSON_COLUMNS: Record<PersonKind, string> = { contact: CONTACT_COLUMNS, pickup: `${CONTACT_COLUMNS}, national_id` };

export async function fetchChildPeople(childId: string): Promise<ChildPeople> {
  const [contacts, pickupPeople] = await Promise.all([
    supabase.from(PERSON_TABLES.contact).select(PERSON_COLUMNS.contact).eq('child_id', childId).order('created_at'),
    supabase.from(PERSON_TABLES.pickup).select(PERSON_COLUMNS.pickup).eq('child_id', childId).order('created_at'),
  ]);
  return { emergencyContacts: throwOnError<ChildContact[]>(contacts), pickupPeople: throwOnError<PickupPerson[]>(pickupPeople) };
}

/** Null when the person does not read (removed, or of another nursery). */
export async function fetchChildPerson(kind: PersonKind, personId: string): Promise<ChildPerson | null> {
  return throwOnError<ChildPerson | null>(await supabase.from(PERSON_TABLES[kind]).select(PERSON_COLUMNS[kind]).eq('id', personId).maybeSingle());
}

interface PersonTarget {
  kind: PersonKind;
  nurseryId: string;
  childId: string;
  personId: string | null;
}

/** RLS (`emergency_contacts_director`, `pickup_people_director`) writes nothing for another nursery, so an empty result is a failure. */
export async function saveChildPerson({ kind, nurseryId, childId, personId }: PersonTarget, row: PersonRow): Promise<void> {
  const table = supabase.from(PERSON_TABLES[kind]);
  const query = personId ? table.update(row).eq('id', personId) : table.insert({ ...row, nursery_id: nurseryId, child_id: childId });
  const saved = throwOnError<{ id: string }[]>(await query.select('id'));
  if (!saved.length) throw new Error('person_not_saved');
}
