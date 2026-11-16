import type { ChildPeople } from '@/lib/child-people';
import { groupLabel, type ShiftName } from '@/lib/shift';

import { fetchChildPeople } from './child-people';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface ChildFile extends ChildPeople {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  photoPath: string | null;
  allergies: string | null;
  groupLabels: string[];
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

export async function fetchChildFile(childId: string): Promise<ChildFile> {
  const [childResult, people] = await Promise.all([
    supabase
      .from('children')
      .select('id, first_name, last_name, birth_date, photo_path, allergies, enrollments(ended_at, rooms(name), shifts(name))')
      .eq('id', childId)
      .single(),
    fetchChildPeople(childId),
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
    ...people,
  };
}
