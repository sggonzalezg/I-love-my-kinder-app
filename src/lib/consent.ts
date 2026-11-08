// Consent logic for S0c.
export const LOGIN_DOCUMENTS = {
  terms: { id: 'terms', version: '1.9' },
  privacy: { id: 'privacy', version: '1.10' },
} as const;

interface ConsentRecord {
  document_id: string;
  version: string;
  accepted: boolean;
}

// Returns which login documents need acceptance.
export function getDocumentsToAccept(records: ConsentRecord[]): string[] {
  const accepted = new Map(
    records
      .filter((r) => r.accepted)
      .map((r) => [`${r.document_id}-${r.version}`, true])
  );

  const needAccept: string[] = [];
  if (!accepted.has(`terms-${LOGIN_DOCUMENTS.terms.version}`)) {
    needAccept.push('terms');
  }
  if (!accepted.has(`privacy-${LOGIN_DOCUMENTS.privacy.version}`)) {
    needAccept.push('privacy');
  }

  return needAccept;
}

export interface NoticeRecord {
  document_version: string;
  accepted: boolean;
}

// record-consent stores the version as a number ("1" for "1.0"), so versions are compared as numbers.
/** One-time notices (save media, chat): `records` come newest first and the latest one decides. */
export function noticeNeeded(records: NoticeRecord[], currentVersion: string): boolean {
  const latest = records[0];
  return !latest || !latest.accepted || Number(latest.document_version) !== Number(currentVersion);
}
