import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

export type AuthorizationKey = keyof typeof CHILD_AUTHORIZATIONS;
export type AuthorizationDocumentId = (typeof CHILD_AUTHORIZATIONS)[AuthorizationKey]['id'];

export const AUTHORIZATION_KEYS = Object.keys(CHILD_AUTHORIZATIONS) as AuthorizationKey[];

export interface AuthorizationRecord {
  document_type: string;
  accepted: boolean;
  created_at: string;
}

export interface AuthorizationState {
  granted: boolean;
  changedAt: string | null;
}

/** The latest record of each document decides; none means not authorized (legal: unchecked by default). */
export function currentAuthorizations(records: AuthorizationRecord[]): Record<AuthorizationDocumentId, AuthorizationState> {
  const states = Object.fromEntries(
    AUTHORIZATION_KEYS.map((key) => [CHILD_AUTHORIZATIONS[key].id, { granted: false, changedAt: null }]),
  ) as Record<AuthorizationDocumentId, AuthorizationState>;

  const oldestFirst = [...records].sort((first, second) => first.created_at.localeCompare(second.created_at));
  for (const record of oldestFirst) {
    if (record.document_type in states) {
      states[record.document_type as AuthorizationDocumentId] = { granted: record.accepted, changedAt: record.created_at };
    }
  }
  return states;
}

const twoDigits = (value: number) => String(value).padStart(2, '0');

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${twoDigits(date.getDate())}/${twoDigits(date.getMonth() + 1)}/${date.getFullYear()} ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
}

// shortcut: RLS returns only the person's own consent rows, so every change reads "vos"; name the other guardian once backend exposes their rows.
export function authorizationChangeLine(state: AuthorizationState): string | null {
  if (!state.changedAt) return null;
  const verb = state.granted ? 'Lo autorizaste vos' : 'Lo retiraste vos';
  return `${verb} · ${formatDateTime(state.changedAt)}`;
}
