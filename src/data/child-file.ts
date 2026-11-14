import { groupLabel, type ShiftName } from '@/lib/shift';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface ChildContact {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
}

export interface PickupPerson extends ChildContact {
  national_id: string | null;
}

export interface ChildFile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  photoPath: string | null;
  allergies: string | null;
  groupLabels: string[];
  emergencyContacts: ChildContact[];
  pickupPeople: PickupPerson[];
}

interface ChildRow {
  id: string;
  first_name: string;
  last_name: string | null;
  birth_date: string | null;
  photo_path: string | null;
  allergies: string | null;
  enrollments: { ended_at: string | null; rooms: { name: string } | null; shifts: { name: ShiftName } | null }[];
}

const CONTACT_COLUMNS = 'id, name, relationship, phone';

export async function fetchChildFile(childId: string): Promise<ChildFile> {
  const [childResult, contactsResult, pickupResult] = await Promise.all([
    supabase
      .from('children')
      .select('id, first_name, last_name, birth_date, photo_path, allergies, enrollments(ended_at, rooms(name), shifts(name))')
      .eq('id', childId)
      .single(),
    supabase.from('emergency_contacts').select(CONTACT_COLUMNS).eq('child_id', childId).order('created_at'),
    supabase.from('pickup_people').select(`${CONTACT_COLUMNS}, national_id`).eq('child_id', childId).order('created_at'),
  ]);
  const child = throwOnError<ChildRow>(childResult);

  return {
    id: child.id,
    firstName: child.first_name,
    lastName: child.last_name ?? '',
    birthDate: child.birth_date,
    photoPath: child.photo_path,
    allergies: child.allergies,
    groupLabels: child.enrollments.flatMap((enrollment) =>
      !enrollment.ended_at && enrollment.rooms && enrollment.shifts ? [groupLabel(enrollment.rooms.name, enrollment.shifts.name)] : [],
    ),
    emergencyContacts: throwOnError<ChildContact[]>(contactsResult),
    pickupPeople: throwOnError<PickupPerson[]>(pickupResult),
  };
}
