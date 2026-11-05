// Role resolution from database profile rows.

export type Role = 'family' | 'teacher' | 'director';

export interface Profile {
  user_id: string;
  family_members?: { id: string; role?: string }[];
  teachers?: { id: string; role?: string }[];
  directors?: { id: string }[];
}

export function resolveRoles(profile: Profile | null): Role[] {
  if (!profile) return [];
  const roles: Role[] = [];
  if (profile.family_members?.length) roles.push('family');
  if (profile.teachers?.length) roles.push('teacher');
  if (profile.directors?.length || profile.teachers?.some((t) => t.role === 'director')) roles.push('director');
  return roles;
}

export function getActiveRole(roles: Role[], savedRole: Role | null): Role {
  if (savedRole && roles.includes(savedRole)) return savedRole;
  if (roles.includes('teacher')) return 'teacher';
  if (roles.includes('family')) return 'family';
  if (roles.includes('director')) return 'director';
  return 'family';
}
