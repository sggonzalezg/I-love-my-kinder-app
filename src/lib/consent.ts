// Document ids and versions from legal/consent-texts.md v1.10. Texts shown on screen live in src/legal/texts.ts.
export const LOGIN_DOCUMENTS = {
  terms: { type: 'terms', version: '1.9' },
  privacy: { type: 'privacy', version: '1.10' },
} as const;

export type LoginDocument = keyof typeof LOGIN_DOCUMENTS;

export type ConsentRow = {
  document_type: string;
  document_version: string;
  accepted: boolean;
  created_at: string;
};

/** Latest row per document decides: accepted at the current version, or ask again. */
export function hasAccepted(rows: ConsentRow[], type: string, version: string): boolean {
  const latest = rows
    .filter((r) => r.document_type === type)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  return !!latest && latest.accepted && latest.document_version === version;
}

export function missingLoginConsents(rows: ConsentRow[]): LoginDocument[] {
  return (Object.keys(LOGIN_DOCUMENTS) as LoginDocument[]).filter(
    (key) => !hasAccepted(rows, LOGIN_DOCUMENTS[key].type, LOGIN_DOCUMENTS[key].version),
  );
}
