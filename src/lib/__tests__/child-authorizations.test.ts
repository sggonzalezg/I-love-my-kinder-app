import { AUTHORIZATION_STATES, signedAuthorizations, type ChildConsentRecord, type Guardian } from '../child-authorizations';

const ANA: Guardian = { userId: 'user-ana', name: 'Ana Rodríguez' };
const MARTIN: Guardian = { userId: 'user-martin', name: 'Martín Rodríguez' };

function record(overrides: Partial<ChildConsentRecord>): ChildConsentRecord {
  return { document_type: 'auth_image', document_version: '2.0', accepted: true, created_at: '2026-03-03T13:00:00Z', user_id: ANA.userId, ...overrides };
}

describe('signedAuthorizations', () => {
  it('lists image, visibility and health in that order', () => {
    expect(signedAuthorizations([], [ANA]).map((authorization) => authorization.key)).toEqual(['image', 'visibility', 'health']);
  });

  it('marks an authorization nobody answered as unanswered, never as no', () => {
    expect(signedAuthorizations([], [ANA])[0]).toEqual({ key: 'image', state: AUTHORIZATION_STATES.unanswered, detail: null });
  });

  it('names who signed, the day and the version of a granted authorization', () => {
    const [image] = signedAuthorizations([record({})], [ANA]);

    expect(image).toEqual({ key: 'image', state: AUTHORIZATION_STATES.granted, detail: 'Ana Rodríguez · 03/03/2026 · v2.0' });
  });

  it('marks a refused authorization as denied', () => {
    const [image] = signedAuthorizations([record({ accepted: false })], [ANA]);

    expect(image.state).toBe(AUTHORIZATION_STATES.denied);
  });

  it('follows the newest answer of any guardian', () => {
    const records = [
      record({ accepted: true, created_at: '2026-03-03T13:00:00Z' }),
      record({ accepted: false, created_at: '2026-04-10T13:00:00Z', user_id: MARTIN.userId }),
    ];

    const [image] = signedAuthorizations(records, [ANA, MARTIN]);

    expect(image).toEqual({ key: 'image', state: AUTHORIZATION_STATES.denied, detail: 'Martín Rodríguez · 10/04/2026 · v2.0' });
  });

  it('ignores the answers of someone who is no longer a guardian', () => {
    const records = [record({ accepted: true }), record({ accepted: false, created_at: '2026-04-10T13:00:00Z', user_id: 'user-former' })];

    expect(signedAuthorizations(records, [ANA])[0].state).toBe(AUTHORIZATION_STATES.granted);
  });

  it('keeps each document apart', () => {
    const records = [record({ document_type: 'auth_health', document_version: 1, created_at: '2026-10-24T13:00:00Z' })];

    const [image, , health] = signedAuthorizations(records, [ANA]);

    expect(image.state).toBe(AUTHORIZATION_STATES.unanswered);
    expect(health.detail).toBe('Ana Rodríguez · 24/10/2026 · v1');
  });

  it('leaves the version out when the record has none', () => {
    const [image] = signedAuthorizations([record({ document_version: null })], [ANA]);

    expect(image.detail).toBe('Ana Rodríguez · 03/03/2026');
  });
});
