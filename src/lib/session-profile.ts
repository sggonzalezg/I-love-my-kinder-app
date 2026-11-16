import { getActiveRole, resolveRoles, type Role } from '@/lib/role';

export interface PersonRow {
  id: string;
  nursery_id: string;
  first_name: string;
  last_name: string;
  photo_path?: string | null;
}

export interface TeacherRow extends PersonRow {
  status: string;
}

export interface LinkedRows {
  familyMembers: PersonRow[];
  teachers: TeacherRow[];
  directors: PersonRow[];
}

export interface LinkedProfile {
  roles: Role[];
  activeRole: Role;
  nurseryId: string;
  personName: string;
  photoPath: string | null;
}

const INACTIVE_TEACHER_STATUS = 'inactive';

/**
 * Null means the account has no access: a removed family access unlinks the row,
 * a deactivated teacher keeps hers as inactive, and a director row only reads while allowlisted.
 */
export function linkedProfile(rows: LinkedRows): LinkedProfile | null {
  const teachers = rows.teachers.filter((teacher) => teacher.status !== INACTIVE_TEACHER_STATUS);
  const roles = resolveRoles({ user_id: '', family_members: rows.familyMembers, teachers, directors: rows.directors });
  if (!roles.length) return null;

  const activeRole = getActiveRole(roles, null);
  const rowsByRole: Record<Role, PersonRow[]> = { family: rows.familyMembers, teacher: teachers, director: rows.directors };
  const person = rowsByRole[activeRole][0];
  return {
    roles,
    activeRole,
    nurseryId: person.nursery_id,
    personName: `${person.first_name} ${person.last_name}`.trim(),
    photoPath: person.photo_path ?? null,
  };
}
