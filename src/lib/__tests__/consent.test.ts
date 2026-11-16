import { legalDocumentDate, LOGIN_DOCUMENT_IDS, LOGIN_DOCUMENTS, noticeNeeded, pendingLoginDocuments } from '../consent';

describe('LOGIN_DOCUMENTS', () => {
  it('points at the backend ids and the current versions of consent-texts.md v1.21', () => {
    expect(LOGIN_DOCUMENTS).toEqual({
      terms: { id: 'terms', version: '1.11' },
      privacy: { id: 'privacy_policy', version: '1.20' },
    });
  });

  it('lists the ids the sign-in check reads', () => {
    expect(LOGIN_DOCUMENT_IDS).toEqual(['terms', 'privacy_policy']);
  });
});

describe('pendingLoginDocuments keys', () => {
  const pendingKeys = (records: Parameters<typeof pendingLoginDocuments>[0]) => pendingLoginDocuments(records).map((document) => document.key);

  it('returns both documents when none are accepted', () => {
    expect(pendingKeys([])).toEqual(['terms', 'privacy']);
  });

  it('returns privacy when only terms is accepted', () => {
    const records = [{ document_type: 'terms', document_version: '1.11', accepted: true }];
    expect(pendingKeys(records)).toEqual(['privacy']);
  });

  it('returns terms when only privacy_policy is accepted', () => {
    const records = [{ document_type: 'privacy_policy', document_version: '1.20', accepted: true }];
    expect(pendingKeys(records)).toEqual(['terms']);
  });

  it('returns nothing when both current versions are accepted', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.20', accepted: true },
    ];
    expect(pendingKeys(records)).toEqual([]);
  });

  it('asks again when the accepted versions are older', () => {
    const records = [
      { document_type: 'terms', document_version: '1.9', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.10', accepted: true },
    ];
    expect(pendingKeys(records)).toEqual(['terms', 'privacy']);
  });

  it('does not take privacy_policy 1.2 for 1.20, because versions are text', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.2', accepted: true },
    ];
    expect(pendingKeys(records)).toEqual(['privacy']);
  });

  it('ignores withdrawn consents', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.20', accepted: false },
    ];
    expect(pendingKeys(records)).toEqual(['privacy']);
  });
});

describe('pendingLoginDocuments', () => {
  it('asks for both documents, as new, on the first sign-in', () => {
    expect(pendingLoginDocuments([])).toEqual([
      { key: 'terms', updated: false },
      { key: 'privacy', updated: false },
    ]);
  });

  it('asks only for the document whose version changed, marked as updated', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.19', accepted: true },
    ];
    expect(pendingLoginDocuments(records)).toEqual([{ key: 'privacy', updated: true }]);
  });

  it('does not take a withdrawn older version as an earlier acceptance', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.19', accepted: false },
    ];
    expect(pendingLoginDocuments(records)).toEqual([{ key: 'privacy', updated: false }]);
  });

  it('asks for nothing when both current versions are accepted', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.20', accepted: true },
    ];
    expect(pendingLoginDocuments(records)).toEqual([]);
  });
});

describe('legalDocumentDate', () => {
  it('reads the date of the version line that opens a document', () => {
    expect(legalDocumentDate('Versión 1.11 · 08/11/2026\n\n## 1. Qué es la app')).toBe('08/11/2026');
  });

  it('is null when the document does not open with a version line', () => {
    expect(legalDocumentDate('## 1. Qué es la app')).toBeNull();
  });
});

describe('noticeNeeded', () => {
  it('asks when the user never accepted the notice', () => {
    expect(noticeNeeded([], '1.0')).toBe(true);
  });

  it('does not ask when the latest record accepted the current version, stored as a number', () => {
    expect(noticeNeeded([{ document_version: '1', accepted: true }], '1.0')).toBe(false);
  });

  it('asks again for a new version', () => {
    expect(noticeNeeded([{ document_version: '1', accepted: true }], '1.1')).toBe(true);
  });

  it('follows the latest record when the notice was withdrawn', () => {
    expect(
      noticeNeeded(
        [
          { document_version: '1', accepted: false },
          { document_version: '1', accepted: true },
        ],
        '1.0',
      ),
    ).toBe(true);
  });
});
