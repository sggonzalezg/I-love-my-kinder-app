import { AUTHORIZATION_KEYS, type AuthorizationKey } from '@/lib/authorizations';
import type { ChildAuthorizationStateRow } from '@/lib/child-authorization-status';
import { signedAuthorizations, type ChildConsentRecord, type SignedAuthorization } from '@/lib/child-authorizations';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface GuardianLinkRow {
  family_members: { user_id: string | null; first_name: string; last_name: string | null } | null;
}

const AUTHORIZATION_DOCUMENT_IDS = AUTHORIZATION_KEYS.map((key) => CHILD_AUTHORIZATIONS[key].id);

export const AUTHORIZATION_ANSWER_SCREENS = { firstSignIn: 'F3a', childAuthorizations: 'F3' } as const;
export type AuthorizationAnswerScreen = (typeof AUTHORIZATION_ANSWER_SCREENS)[keyof typeof AUTHORIZATION_ANSWER_SCREENS];

/** Without a child: the caller's own enrolled children; with one: that child, for her guardians, teachers or director. */
export async function fetchChildAuthorizationStates(targetChildId?: string): Promise<ChildAuthorizationStateRow[]> {
  return throwOnError<ChildAuthorizationStateRow[]>(
    await supabase.rpc('get_child_authorization_states', targetChildId ? { target_child_id: targetChildId } : {}),
  );
}

export interface ChildAuthorizationsContext {
  childFirstName: string;
  childFullName: string;
  guardianCount: number;
  ownFirstName: string;
  rows: ChildAuthorizationStateRow[];
}

interface ChildWithGuardianLinksRow {
  first_name: string;
  last_name: string | null;
  family_member_children: { family_member_id: string }[];
}

export async function fetchChildAuthorizationsContext(childId: string, userId: string): Promise<ChildAuthorizationsContext> {
  const [child, ownMember, rows] = await Promise.all([
    supabase.from('children').select('first_name, last_name, family_member_children(family_member_id)').eq('id', childId).single(),
    supabase.from('family_members').select('first_name').eq('user_id', userId).limit(1),
    fetchChildAuthorizationStates(childId),
  ]);
  const { first_name: firstName, last_name: lastName, family_member_children: guardianLinks } = throwOnError<ChildWithGuardianLinksRow>(child);
  return {
    childFirstName: firstName,
    childFullName: [firstName, lastName].filter(Boolean).join(' '),
    guardianCount: guardianLinks.length,
    ownFirstName: throwOnError<{ first_name: string }[]>(ownMember)[0]?.first_name ?? '',
    rows,
  };
}

interface AuthorizationAnswerInput {
  childId: string;
  key: AuthorizationKey;
  accepted: boolean;
  screen: AuthorizationAnswerScreen;
}

/** The server stamps the current version, the IP and the user agent of the consent record. */
export async function answerChildAuthorization({ childId, key, accepted, screen }: AuthorizationAnswerInput): Promise<void> {
  throwOnError(
    await supabase.rpc('answer_child_authorization', {
      target_child_id: childId,
      authorization_type: CHILD_AUTHORIZATIONS[key].id,
      is_accepted: accepted,
      answer_screen: screen,
    }),
  );
}

export async function fetchChildAuthorizations(childId: string): Promise<SignedAuthorization[]> {
  const [records, guardianLinks] = await Promise.all([
    supabase
      .from('consent_records')
      .select('document_type, document_version, accepted, created_at, user_id')
      .eq('child_id', childId)
      .in('document_type', AUTHORIZATION_DOCUMENT_IDS),
    supabase.from('family_member_children').select('family_members(user_id, first_name, last_name)').eq('child_id', childId),
  ]);
  const guardians = throwOnError<GuardianLinkRow[]>(guardianLinks).flatMap(({ family_members: member }) =>
    member?.user_id ? [{ userId: member.user_id, name: [member.first_name, member.last_name].filter(Boolean).join(' ') }] : [],
  );
  return signedAuthorizations(throwOnError<ChildConsentRecord[]>(records), guardians);
}
