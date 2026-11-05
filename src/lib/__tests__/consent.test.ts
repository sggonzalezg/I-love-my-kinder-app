import { LOGIN_DOCUMENTS, missingLoginConsents, type ConsentRow } from '../consent';

const row = (document_type: string, document_version: string, accepted: boolean, created_at: string): ConsentRow => ({
  document_type,
  document_version,
  accepted,
  created_at,
});

describe('login consent (S0c)', () => {
  it('requires both terms and privacy on first login', () => {
    expect(missingLoginConsents([])).toEqual(['terms', 'privacy']);
  });

  it('requires nothing when the current versions were accepted', () => {
    const rows = [
      row('terms', LOGIN_DOCUMENTS.terms.version, true, '2026-11-01T10:00:00Z'),
      row('privacy', LOGIN_DOCUMENTS.privacy.version, true, '2026-11-01T10:00:00Z'),
    ];
    expect(missingLoginConsents(rows)).toEqual([]);
  });

  it('asks again only for the document whose version changed', () => {
    const rows = [
      row('terms', '1.0', true, '2026-10-01T10:00:00Z'),
      row('privacy', LOGIN_DOCUMENTS.privacy.version, true, '2026-11-01T10:00:00Z'),
    ];
    expect(missingLoginConsents(rows)).toEqual(['terms']);
  });

  it('treats a later withdrawal as not accepted', () => {
    const rows = [
      row('terms', LOGIN_DOCUMENTS.terms.version, true, '2026-11-01T10:00:00Z'),
      row('terms', LOGIN_DOCUMENTS.terms.version, false, '2026-11-02T10:00:00Z'),
      row('privacy', LOGIN_DOCUMENTS.privacy.version, true, '2026-11-01T10:00:00Z'),
    ];
    expect(missingLoginConsents(rows)).toEqual(['terms']);
  });
});
