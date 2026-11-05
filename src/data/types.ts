// Session and auth types.

import type { Role } from '@/lib/role';

export interface AuthSession {
  user_id: string;
  phone: string;
  roles: Role[];
  active_role: Role;
  nursery_id: string;
  nursery_urgent_phone: string;
  nursery_name: string;
  person_name: string;
  profile_photo?: string;
}

export interface AuthError {
  code: 'unknown_number' | 'inactive_teacher' | 'network' | 'invalid_code' | 'expired_code' | 'too_many_attempts';
  message: string;
}
