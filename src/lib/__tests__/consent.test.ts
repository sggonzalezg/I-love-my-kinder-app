import { getDocumentsToAccept, LOGIN_DOCUMENT_IDS, LOGIN_DOCUMENTS, noticeNeeded } from '../consent';

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

describe('getDocumentsToAccept', () => {
  it('returns both documents when none are accepted', () => {
    expect(getDocumentsToAccept([])).toEqual(['terms', 'privacy_policy']);
  });

  it('returns privacy_policy when only terms is accepted', () => {
    const records = [{ document_type: 'terms', document_version: '1.11', accepted: true }];
    expect(getDocumentsToAccept(records)).toEqual(['privacy_policy']);
  });

  it('returns terms when only privacy_policy is accepted', () => {
    const records = [{ document_type: 'privacy_policy', document_version: '1.20', accepted: true }];
    expect(getDocumentsToAccept(records)).toEqual(['terms']);
  });

  it('returns nothing when both current versions are accepted', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.20', accepted: true },
    ];
    expect(getDocumentsToAccept(records)).toEqual([]);
  });

  it('asks again when the accepted versions are older', () => {
    const records = [
      { document_type: 'terms', document_version: '1.9', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.10', accepted: true },
    ];
    expect(getDocumentsToAccept(records)).toEqual(['terms', 'privacy_policy']);
  });

  it('does not take privacy_policy 1.2 for 1.20, because versions are text', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.2', accepted: true },
    ];
    expect(getDocumentsToAccept(records)).toEqual(['privacy_policy']);
  });

  it('ignores withdrawn consents', () => {
    const records = [
      { document_type: 'terms', document_version: '1.11', accepted: true },
      { document_type: 'privacy_policy', document_version: '1.20', accepted: false },
    ];
    expect(getDocumentsToAccept(records)).toEqual(['privacy_policy']);
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
