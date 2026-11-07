import type { OutingAnswer } from '../outing';
import {
  childPermission,
  familyOutingRequests,
  familyOutingStatus,
  firstName,
  formatAnswerDay,
  formatHistoryMoment,
  formatOutingDay,
  formatOutingShortDay,
  isInOutingAudience,
  pendingRequestLine,
  permissionHistory,
  transportClause,
} from '../outing-permission';

const ME = 'user-ana';
const OTHER = 'user-pablo';
const OUTING = { startsAt: '2026-10-29T10:00:00', permissionVersion: 1 };
const BEFORE_OUTING = new Date('2026-10-27T08:00:00');

const row = (overrides: Partial<OutingAnswer>): OutingAnswer => ({
  child_id: 'c1',
  decision: 'authorized',
  created_at: '2026-10-24T18:02:00',
  permission_version: 1,
  signer_name: 'Ana Rodríguez',
  signer_relationship: 'mother',
  signed_by: ME,
  ...overrides,
});

const REQUEST = row({ decision: 'pending', created_at: '2026-10-24T09:15:00', signer_name: 'System', signer_relationship: 'System', signed_by: null });

describe('childPermission', () => {
  it('is pending and open when only the request exists', () => {
    const permission = childPermission([REQUEST], 'c1', OUTING, ME, BEFORE_OUTING);
    expect(permission).toMatchObject({ status: 'pending', answeredBy: null, locked: false, askedAgain: false });
  });

  it('says the answer is mine when I signed it', () => {
    expect(childPermission([REQUEST, row({})], 'c1', OUTING, ME, BEFORE_OUTING).answeredBy).toBe('me');
  });

  it('says the other guardian answered when someone else signed it', () => {
    const rows = [REQUEST, row({ signed_by: OTHER, signer_name: 'Pablo Rodríguez' })];
    expect(childPermission(rows, 'c1', OUTING, ME, BEFORE_OUTING).answeredBy).toBe('other');
  });

  it('locks the answer from the moment the outing starts', () => {
    expect(childPermission([row({})], 'c1', OUTING, ME, new Date('2026-10-29T10:00:00')).locked).toBe(true);
  });

  it('asks again when the outing changed after an answer', () => {
    const rows = [row({ permission_version: 1 })];
    const permission = childPermission(rows, 'c1', { ...OUTING, permissionVersion: 2 }, ME, BEFORE_OUTING);
    expect(permission).toMatchObject({ status: 'pending', askedAgain: true });
  });

  it('does not ask again once the new version is answered', () => {
    const rows = [row({ permission_version: 1 }), row({ permission_version: 2, created_at: '2026-10-26T10:00:00' })];
    expect(childPermission(rows, 'c1', { ...OUTING, permissionVersion: 2 }, ME, BEFORE_OUTING).askedAgain).toBe(false);
  });
});

describe('permissionHistory', () => {
  it('lists every step for the child, newest first', () => {
    const rows = [
      REQUEST,
      row({}),
      row({ decision: 'withdrawn', created_at: '2026-10-27T08:40:00' }),
      row({ child_id: 'c2', decision: 'declined' }),
    ];
    expect(permissionHistory(rows, 'c1')).toEqual([
      { at: '2026-10-27T08:40:00', text: 'Ana Rodríguez retiró la autorización' },
      { at: '2026-10-24T18:02:00', text: 'Ana Rodríguez autorizó' },
      { at: '2026-10-24T09:15:00', text: 'El jardín pidió el permiso' },
    ]);
  });

  it('says when a guardian did not authorize', () => {
    expect(permissionHistory([row({ decision: 'declined' })], 'c1')[0].text).toBe('Ana Rodríguez no autorizó');
  });
});

describe('outing copy helpers', () => {
  it('says "a pie" for a walking outing', () => {
    expect(transportClause('Caminando')).toBe('a pie');
    expect(transportClause('A pie')).toBe('a pie');
  });

  it('says "en" and the transport for any other way of going', () => {
    expect(transportClause('Ómnibus contratado')).toBe('en ómnibus contratado');
  });

  it('formats the outing day, the short day and the answer moments', () => {
    expect(formatOutingDay('2026-10-29T10:00:00')).toBe('jueves 29 de octubre');
    expect(formatOutingShortDay('2026-10-29T10:00:00')).toBe('jueves 29');
    expect(formatAnswerDay('2026-10-23T18:02:00')).toBe('viernes 23/10');
    expect(formatHistoryMoment('2026-10-23T09:15:00')).toBe('23/10 9:15');
  });

  it('takes the first name of a signer', () => {
    expect(firstName('Ana Rodríguez')).toBe('Ana');
  });

  it('builds the Hoy card line with the outing, its day and the children', () => {
    expect(pendingRequestLine('Salida al Parque Rodó', '2026-10-29T10:00:00', ['Mateo', 'Sofía'])).toBe(
      'Salida al Parque Rodó · jueves 29 · Mateo y Sofía',
    );
  });
});

describe('isInOutingAudience', () => {
  const child = { id: 'c1', groups: [{ roomId: 'room-2', shiftId: 'morning' }] };

  it('includes a child of the outing room and shift', () => {
    expect(isInOutingAudience(child, { roomId: 'room-2', shiftId: 'morning' })).toBe(true);
  });

  it('includes every child in a nursery-wide outing', () => {
    expect(isInOutingAudience(child, { roomId: null, shiftId: null })).toBe(true);
  });

  it('leaves out a child of another shift', () => {
    expect(isInOutingAudience(child, { roomId: 'room-2', shiftId: 'afternoon' })).toBe(false);
  });
});

describe('familyOutingRequests', () => {
  const outing = { id: 'e1', title: 'Salida al Parque Rodó', ...OUTING, roomId: 'room-2', shiftId: 'morning' };
  const mateo = { id: 'c1', firstName: 'Mateo', groups: [{ roomId: 'room-2', shiftId: 'morning' }] };
  const sofia = { id: 'c2', firstName: 'Sofía', groups: [{ roomId: 'room-3', shiftId: 'morning' }] };

  it('names only the invited children still without an answer', () => {
    expect(familyOutingRequests([outing], [mateo, sofia], {})).toEqual([
      { eventId: 'e1', title: 'Salida al Parque Rodó', startsAt: OUTING.startsAt, status: 'pending', pendingChildNames: ['Mateo'] },
    ]);
  });

  it('marks the outing answered once the invited child has an answer', () => {
    const [request] = familyOutingRequests([outing], [mateo], { e1: [row({})] });
    expect(request).toMatchObject({ status: 'authorized', pendingChildNames: [] });
  });

  it('leaves out outings with none of the family children', () => {
    expect(familyOutingRequests([outing], [sofia], {})).toEqual([]);
  });
});

describe('familyOutingStatus', () => {
  const outing = { ...OUTING, childIds: ['c1', 'c2'] };

  it('is pending while any of the children has no answer', () => {
    expect(familyOutingStatus(outing, [row({ child_id: 'c1' })])).toBe('pending');
  });

  it('is authorized when every child is authorized', () => {
    expect(familyOutingStatus(outing, [row({ child_id: 'c1' }), row({ child_id: 'c2' })])).toBe('authorized');
  });

  it('is declined when every child has an answer and one is not authorized', () => {
    expect(familyOutingStatus(outing, [row({ child_id: 'c1' }), row({ child_id: 'c2', decision: 'declined' })])).toBe('declined');
  });
});
