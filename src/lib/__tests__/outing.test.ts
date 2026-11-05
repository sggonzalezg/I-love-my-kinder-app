import { permissionStatus, summarizePermissions, type OutingAnswer } from '../outing';

const answer = (child_id: string, decision: OutingAnswer['decision'], created_at: string, permission_version = 1): OutingAnswer => ({
  child_id,
  decision,
  created_at,
  permission_version,
  signer_name: 'Ana Rodríguez',
  signer_relationship: 'mother',
});

describe('outing permission per child (round 11)', () => {
  it('is pending with no answer', () => {
    expect(permissionStatus([], 'c1', 1).status).toBe('pending');
  });

  it('takes the latest answer from any guardian for the child', () => {
    const rows = [answer('c1', 'authorized', '2026-10-24T18:02:00Z'), answer('c1', 'withdrawn', '2026-10-25T09:00:00Z')];
    expect(permissionStatus(rows, 'c1', 1).status).toBe('declined');
  });

  it('ignores answers to an older outing version (a material change asks again)', () => {
    const rows = [answer('c1', 'authorized', '2026-10-24T18:02:00Z', 1)];
    expect(permissionStatus(rows, 'c1', 2).status).toBe('pending');
  });

  it('counts one authorization per child', () => {
    const rows = [
      answer('c1', 'authorized', '2026-10-24T18:00:00Z'),
      answer('c1', 'authorized', '2026-10-24T18:05:00Z'),
      answer('c2', 'declined', '2026-10-24T19:00:00Z'),
    ];
    expect(summarizePermissions(rows, ['c1', 'c2', 'c3'], 1)).toEqual({ authorized: 1, declined: 1, pending: 1 });
  });
});
