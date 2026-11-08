import { getDocumentsToAccept, LOGIN_DOCUMENTS, noticeNeeded } from '../consent';

describe('consent', () => {
  it('returns both documents when none are accepted', () => {
    expect(getDocumentsToAccept([])).toEqual(['terms', 'privacy']);
  });

  it('returns privacy when only terms is accepted', () => {
    const records = [{ document_id: 'terms', version: '1.9', accepted: true }];
    expect(getDocumentsToAccept(records)).toEqual(['privacy']);
  });

  it('returns terms when only privacy is accepted', () => {
    const records = [{ document_id: 'privacy', version: '1.10', accepted: true }];
    expect(getDocumentsToAccept(records)).toEqual(['terms']);
  });

  it('returns empty array when both are accepted', () => {
    const records = [
      { document_id: 'terms', version: '1.9', accepted: true },
      { document_id: 'privacy', version: '1.10', accepted: true },
    ];
    expect(getDocumentsToAccept(records)).toEqual([]);
  });

  it('asks for new version when accepted version is old', () => {
    const records = [
      { document_id: 'terms', version: '1.8', accepted: true },
      { document_id: 'privacy', version: '1.9', accepted: true },
    ];
    expect(getDocumentsToAccept(records)).toEqual(['terms', 'privacy']);
  });

  it('ignores withdrawn consents', () => {
    const records = [
      { document_id: 'terms', version: '1.9', accepted: true },
      { document_id: 'privacy', version: '1.10', accepted: false },
    ];
    expect(getDocumentsToAccept(records)).toEqual(['privacy']);
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
