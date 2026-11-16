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

export function getDocumentsToAccept(records: LoginConsentRecord[]): string[] {
  return Object.values(LOGIN_DOCUMENTS)
    .filter(
      (document) =>
        !records.some(
          (record) => record.accepted && record.document_type === document.id && record.document_version === document.version,
        ),
    )
    .map((document) => document.id);
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
