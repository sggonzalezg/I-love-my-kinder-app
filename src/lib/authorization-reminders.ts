import type { AuthorizationKey } from './authorizations';
import { AUTHORIZATION_STATES } from './child-authorizations';
import { childAuthorizationStatuses, firstUnansweredKey, type ChildAuthorizationStateRow } from './child-authorization-status';
import type { FamilyChild } from './room-groups';

export interface AuthorizationReminder {
  childId: string;
  firstName: string;
  lastName: string;
  photoPath: string | null;
  missingKeys: AuthorizationKey[];
  focusKey: AuthorizationKey;
}

/** One card per listed child with something unanswered, in Hoy's order; the backend lists only enrolled, linked children. */
export function authorizationReminders(kids: FamilyChild[], rows: ChildAuthorizationStateRow[]): AuthorizationReminder[] {
  const listedKids = kids.filter((kid) => rows.some((row) => row.child_id === kid.id));
  const statuses = childAuthorizationStatuses(rows, listedKids.map((kid) => kid.id), '');
  return listedKids.flatMap((kid, index) => {
    const focusKey = firstUnansweredKey(statuses[index]);
    if (!focusKey) return [];
    const missingKeys = statuses[index].items.filter((item) => item.state === AUTHORIZATION_STATES.unanswered).map((item) => item.key);
    return [{ childId: kid.id, firstName: kid.firstName, lastName: kid.lastName, photoPath: kid.photoPath, missingKeys, focusKey }];
  });
}

export function unansweredCountOf(rows: ChildAuthorizationStateRow[], childId: string): number {
  return rows.find((row) => row.child_id === childId)?.unanswered_count ?? 0;
}
