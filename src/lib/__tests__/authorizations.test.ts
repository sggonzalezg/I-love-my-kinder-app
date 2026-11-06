import { authorizationChangeLine, currentAuthorizations } from '../authorizations';

describe('currentAuthorizations', () => {
  it('treats a document with no record as not authorized', () => {
    const states = currentAuthorizations([]);

    expect(states.auth_image).toEqual({ granted: false, changedAt: null });
  });

  it('keeps the latest record of each document', () => {
    const records = [
      { document_type: 'auth_image', accepted: true, created_at: '2026-03-03T12:00:00Z' },
      { document_type: 'auth_image', accepted: false, created_at: '2026-10-24T21:02:00Z' },
      { document_type: 'auth_health', accepted: true, created_at: '2026-10-24T21:02:00Z' },
    ];

    const states = currentAuthorizations(records);

    expect(states.auth_image).toEqual({ granted: false, changedAt: '2026-10-24T21:02:00Z' });
    expect(states.auth_health.granted).toBe(true);
    expect(states.auth_visibility.granted).toBe(false);
  });

  it('does not depend on the order the records arrive in', () => {
    const records = [
      { document_type: 'auth_visibility', accepted: true, created_at: '2026-10-24T21:02:00Z' },
      { document_type: 'auth_visibility', accepted: false, created_at: '2026-03-03T12:00:00Z' },
    ];

    expect(currentAuthorizations(records).auth_visibility.granted).toBe(true);
  });
});

describe('authorizationChangeLine', () => {
  it('says who authorized it and when', () => {
    const changedAt = new Date(2026, 9, 24, 18, 2).toISOString();

    expect(authorizationChangeLine({ granted: true, changedAt })).toBe('Lo autorizaste vos · 24/10/2026 18:02');
  });

  it('says who withdrew it and when', () => {
    const changedAt = new Date(2026, 2, 3, 9, 5).toISOString();

    expect(authorizationChangeLine({ granted: false, changedAt })).toBe('Lo retiraste vos · 03/03/2026 09:05');
  });

  it('has no line when nobody answered yet', () => {
    expect(authorizationChangeLine({ granted: false, changedAt: null })).toBeNull();
  });
});
