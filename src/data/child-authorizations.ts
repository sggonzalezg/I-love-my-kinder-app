import { AUTHORIZATION_KEYS } from '@/lib/authorizations';
import { signedAuthorizations, type ChildConsentRecord, type SignedAuthorization } from '@/lib/child-authorizations';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

interface GuardianLinkRow {
  family_members: { user_id: string | null; first_name: string; last_name: string | null } | null;
}

const AUTHORIZATION_DOCUMENT_IDS = AUTHORIZATION_KEYS.map((key) => CHILD_AUTHORIZATIONS[key].id);

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
