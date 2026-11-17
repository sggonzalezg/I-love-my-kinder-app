export const LOGIN_DOCUMENTS = {
  terms: { id: 'terms', version: '1.11' },
  privacy: { id: 'privacy_policy', version: '1.20' },
} as const;

export const LOGIN_CONSENT_SCREEN_ID = 'D1';

export const LOGIN_DOCUMENT_IDS = Object.values(LOGIN_DOCUMENTS).map((document) => document.id);

export interface LoginConsentRecord {
  document_type: string;
  document_version: string;
  accepted: boolean;
}

export type LoginDocumentKey = keyof typeof LOGIN_DOCUMENTS;

/** `updated`: the person accepted an earlier version, so D1 tells them the document changed. */
export interface PendingLoginDocument {
  key: LoginDocumentKey;
  updated: boolean;
}

const LOGIN_DOCUMENT_KEYS = Object.keys(LOGIN_DOCUMENTS) as LoginDocumentKey[];

function acceptedCurrentVersion(records: LoginConsentRecord[], key: LoginDocumentKey): boolean {
  const document = LOGIN_DOCUMENTS[key];
  return records.some((record) => record.accepted && record.document_type === document.id && record.document_version === document.version);
}

function acceptedEarlierVersion(records: LoginConsentRecord[], key: LoginDocumentKey): boolean {
  return records.some((record) => record.accepted && record.document_type === LOGIN_DOCUMENTS[key].id);
}

export function pendingLoginDocuments(records: LoginConsentRecord[]): PendingLoginDocument[] {
  return LOGIN_DOCUMENT_KEYS.filter((key) => !acceptedCurrentVersion(records, key)).map((key) => ({
    key,
    updated: acceptedEarlierVersion(records, key),
  }));
}

const DOCUMENT_DATE_PATTERN = /^Versión [\d.]+ · (\d{2}\/\d{2}\/\d{4})/;

/** Legal documents open with "Versión 1.11 · 08/11/2026"; the date is the one the "Actualizamos…" notice names. */
export function legalDocumentDate(body: string): string | null {
  return body.match(DOCUMENT_DATE_PATTERN)?.[1] ?? null;
}

export interface NoticeRecord {
  document_version: string;
  accepted: boolean;
}

// Rows written before backend migration 035 stored the version as a number ("1" for "1.0"), so notices compare as numbers.
/** One-time notices (save media, chat): `records` come newest first and the latest one decides. */
export function noticeNeeded(records: NoticeRecord[], currentVersion: string): boolean {
  const latest = records[0];
  return !latest || !latest.accepted || Number(latest.document_version) !== Number(currentVersion);
}
