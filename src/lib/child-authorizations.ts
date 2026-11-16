import { AUTHORIZATION_KEYS, type AuthorizationKey } from './authorizations';
import { formatNumericDate } from './dates';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

export const AUTHORIZATION_STATES = { granted: 'granted', denied: 'denied', unanswered: 'unanswered' } as const;
export type AuthorizationAnswer = (typeof AUTHORIZATION_STATES)[keyof typeof AUTHORIZATION_STATES];

export interface ChildConsentRecord {
  document_type: string;
  document_version: string | number | null;
  accepted: boolean;
  created_at: string;
  user_id: string | null;
}

export interface Guardian {
  userId: string;
  name: string;
}

export interface SignedAuthorization {
  key: AuthorizationKey;
  state: AuthorizationAnswer;
  /** "Ana Rodríguez · 03/03/2026 · v2.0"; null while nobody answered. */
  detail: string | null;
}

function signedDetail(record: ChildConsentRecord, signerName: string): string {
  const version = record.document_version === null ? null : `v${record.document_version}`;
  return [signerName, formatNumericDate(new Date(record.created_at)), version].filter(Boolean).join(' · ');
}

/** As backend 064: only the child's current guardians decide, the newest answer wins, and no answer is not a "No". */
export function signedAuthorizations(records: ChildConsentRecord[], guardians: Guardian[]): SignedAuthorization[] {
  const nameByUserId = new Map(guardians.map((guardian) => [guardian.userId, guardian.name]));
  const guardianAnswersNewestFirst = records
    .flatMap((record) => {
      const signerName = record.user_id ? nameByUserId.get(record.user_id) : undefined;
      return signerName ? [{ record, signerName }] : [];
    })
    .sort((first, second) => second.record.created_at.localeCompare(first.record.created_at));

  return AUTHORIZATION_KEYS.map((key) => {
    const latest = guardianAnswersNewestFirst.find(({ record }) => record.document_type === CHILD_AUTHORIZATIONS[key].id);
    if (!latest) return { key, state: AUTHORIZATION_STATES.unanswered, detail: null };
    return {
      key,
      state: latest.record.accepted ? AUTHORIZATION_STATES.granted : AUTHORIZATION_STATES.denied,
      detail: signedDetail(latest.record, latest.signerName),
    };
  });
}
