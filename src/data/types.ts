// Session and auth types.

import type { Role } from '@/lib/role';

export interface AuthSession {
  user_id: string;
  email: string;
  roles: Role[];
  active_role: Role;
  nursery_id: string;
  nursery_urgent_phone: string;
  nursery_name: string;
  person_name: string;
  profile_photo?: string;
}

