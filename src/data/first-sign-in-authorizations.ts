import type { Href } from 'expo-router';

import { FIRST_SIGN_IN_AUTHORIZATIONS_ROUTE, PUSH_PRIMER_ROUTE } from '@/constants/routes';
import type { ChildAuthorizationStateRow } from '@/lib/child-authorization-status';
import { asksFirstSignInAuthorizations, firstSignInStepChildIds, isFirstSignInAuthorizationsDue } from '@/lib/first-sign-in-authorizations';
import type { FamilyChild } from '@/lib/room-groups';

import { fetchChildAuthorizationStates } from './child-authorizations';
import { fetchFamilyChildren } from './family-room';
import { fetchFirstName } from './family-today';
import type { AuthSession } from './types';

export interface FirstSignInAuthorizations {
  ownFirstName: string;
  kids: FamilyChild[];
  rows: ChildAuthorizationStateRow[];
}

export async function fetchFirstSignInAuthorizations(userId: string): Promise<FirstSignInAuthorizations> {
  const [ownFirstName, kids, rows] = await Promise.all([fetchFirstName(userId), fetchFamilyChildren(userId), fetchChildAuthorizationStates()]);
  return { ownFirstName, kids, rows };
}

/**
 * Called only right after a sign-in on this device (code and D1 screens), never for a restored session:
 * families signed in before this release get only the Hoy card.
 */
export async function routeAfterLoginConsent(session: AuthSession): Promise<Href> {
  if (!asksFirstSignInAuthorizations(session.active_role)) return PUSH_PRIMER_ROUTE;
  try {
    const { kids, rows } = await fetchFirstSignInAuthorizations(session.user_id);
    return isFirstSignInAuthorizationsDue(session.active_role, firstSignInStepChildIds(kids, rows)) ? FIRST_SIGN_IN_AUTHORIZATIONS_ROUTE : PUSH_PRIMER_ROUTE;
  } catch (error) {
    console.warn('First sign-in authorizations check failed:', error);
    return PUSH_PRIMER_ROUTE;
  }
}
