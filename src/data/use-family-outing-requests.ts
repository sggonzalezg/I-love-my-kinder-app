import type { FamilyOutingRequest } from '@/lib/outing-permission';
import { fetchFamilyOutingRequests } from './outing-permission';
import { useSession } from './session';
import { useAsync } from './use-async';

/** The family's upcoming outings with their permission status; empty for staff roles. */
export function useFamilyOutingRequests(): FamilyOutingRequest[] {
  const { session } = useSession();
  const userId = session?.active_role === 'family' ? session.user_id : null;
  const requests = useAsync(() => fetchFamilyOutingRequests(userId!, new Date()), userId);
  return requests.data ?? [];
}
