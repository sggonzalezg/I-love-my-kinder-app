import type { ChildAuthorizationItem, ChildAuthorizationStateRow } from './child-authorization-status';
import { AUTHORIZATION_STATES } from './child-authorizations';
import type { Role } from './role';
import type { ChildGroup, FamilyChild } from './room-groups';
import { groupLabel } from './shift';

const FIRST_SIGN_IN_ROLE: Role = 'family';

/** The backend lists only the family's enrolled children; the step list keeps the Hoy order. */
export function firstSignInStepChildIds(kids: FamilyChild[], rows: ChildAuthorizationStateRow[]): string[] {
  return kids
    .filter((kid) => kid.groups.length > 0 && rows.some((row) => row.child_id === kid.id && row.unanswered_count > 0))
    .map((kid) => kid.id);
}

/** Teachers and the direction never reach the first sign-in authorizations. */
export function asksFirstSignInAuthorizations(role: Role): boolean {
  return role === FIRST_SIGN_IN_ROLE;
}

export function isFirstSignInAuthorizationsDue(role: Role, stepChildIds: string[]): boolean {
  return asksFirstSignInAuthorizations(role) && stepChildIds.length > 0;
}

/** On the first sign-in an answer of the other guardian is shown read only: it already counts for the child. */
export function isAnsweredByAnotherGuardian(item: ChildAuthorizationItem): boolean {
  return item.state !== AUTHORIZATION_STATES.unanswered && !item.answeredByMe;
}

export function childGroupsLine(groups: ChildGroup[]): string {
  return groups.map((group) => groupLabel(group.roomName, group.shift)).join(', ');
}
