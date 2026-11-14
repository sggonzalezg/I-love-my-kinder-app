import type { OutingAnswer } from '../outing';
import {
  childPermissionRows,
  goingHeading,
  initialPermissionFilter,
  isOutingDay,
  noGoTitle,
  outingDaySubtitle,
  permissionFilterChips,
  permissionsSubtitle,
  permissionTally,
  rowsForFilter,
  stayingNames,
  type PermissionChild,
} from '../outing-permissions';

const VERSION = 1;
const at = (day: number, hour: number, minute: number) => new Date(2025, 9, day, hour, minute).toISOString();

const child = (id: string, firstName: string, lastName = 'Pérez'): PermissionChild => ({ id, firstName, lastName, photoPath: null });

const answer = (childId: string, decision: OutingAnswer['decision'], createdAt: string, signer = 'Carla Acosta', relationship = 'mother'): OutingAnswer => ({
  child_id: childId,
  decision,
  created_at: createdAt,
  permission_version: VERSION,
  signer_name: signer,
  signer_relationship: relationship,
  signed_by: decision === 'pending' ? null : 'user-1',
});

describe('childPermissionRows', () => {
  it('names who authorized, with the relationship, weekday, date and time', () => {
    const rows = childPermissionRows([answer('sofia', 'pending', at(24, 8, 0)), answer('sofia', 'authorized', at(24, 9, 40))], [child('sofia', 'Sofía')], VERSION);

    expect(rows[0]).toMatchObject({ status: 'authorized', meta: 'Carla (madre) · vie 24/10 9:40' });
  });

  it('marks a declined answer', () => {
    const rows = childPermissionRows([answer('tomas', 'declined', at(25, 11, 20), 'Diego Ruiz', 'father')], [child('tomas', 'Tomás')], VERSION);

    expect(rows[0]).toMatchObject({ status: 'declined', meta: 'Diego (padre) · sáb 25/10 11:20' });
  });

  it('says who withdrew a permission', () => {
    const rows = childPermissionRows(
      [answer('mateo', 'authorized', at(24, 18, 2), 'Ana Rodríguez'), answer('mateo', 'withdrawn', at(27, 8, 40), 'Ana Rodríguez')],
      [child('mateo', 'Mateo')],
      VERSION,
    );

    expect(rows[0]).toMatchObject({ status: 'withdrawn', meta: 'Retiró Ana (madre) · lun 27/10 8:40' });
  });

  it('shows the request date for a child nobody answered', () => {
    const rows = childPermissionRows([answer('valentina', 'pending', at(24, 8, 0))], [child('valentina', 'Valentina')], VERSION);

    expect(rows[0]).toMatchObject({ status: 'pending', meta: 'Pedido el 24/10' });
  });

  it('treats an answer to an older version as pending', () => {
    const oldAnswer = { ...answer('bruno', 'authorized', at(24, 9, 0)), permission_version: 1 };
    const rows = childPermissionRows([oldAnswer, { ...answer('bruno', 'pending', at(26, 10, 0)), permission_version: 2 }], [child('bruno', 'Bruno')], 2);

    expect(rows[0]).toMatchObject({ status: 'pending', meta: 'Pedido el 26/10' });
  });

  it('lists who said no first, then who authorized by time, then the pending by name', () => {
    const rows = childPermissionRows(
      [
        answer('zoe', 'pending', at(24, 8, 0)),
        answer('alma', 'pending', at(24, 8, 0)),
        answer('lorenzo', 'authorized', at(24, 10, 2)),
        answer('sofia', 'authorized', at(24, 9, 40)),
        answer('tomas', 'declined', at(25, 11, 20)),
      ],
      [child('zoe', 'Zoe'), child('alma', 'Alma'), child('lorenzo', 'Lorenzo'), child('sofia', 'Sofía'), child('tomas', 'Tomás')],
      VERSION,
    );

    expect(rows.map((row) => row.child.id)).toEqual(['tomas', 'sofia', 'lorenzo', 'alma', 'zoe']);
  });
});

describe('permission filters', () => {
  const rows = childPermissionRows(
    [
      answer('a', 'authorized', at(24, 9, 0)),
      answer('b', 'declined', at(24, 9, 0)),
      answer('c', 'withdrawn', at(24, 9, 0)),
      answer('d', 'pending', at(24, 8, 0)),
    ],
    [child('a', 'A'), child('b', 'B'), child('c', 'C'), child('d', 'D')],
    VERSION,
  );

  it('counts each child once, a withdrawn permission as not authorized', () => {
    expect(permissionTally(rows)).toEqual({ authorized: 1, declined: 2, pending: 1 });
  });

  it('labels each chip with its count', () => {
    expect(permissionFilterChips(rows).map((chip) => chip.label)).toEqual(['Todos 4', 'Sin responder 1', 'No autorizan 2', 'Autorizaron 1']);
  });

  it('keeps withdrawn permissions under "No autorizan"', () => {
    expect(rowsForFilter(rows, 'declined').map((row) => row.child.id)).toEqual(['b', 'c']);
  });

  it('opens on the pending children while any is left', () => {
    expect(initialPermissionFilter(rows)).toBe('pending');
  });

  it('opens on everyone once every family answered', () => {
    expect(initialPermissionFilter(rowsForFilter(rows, 'authorized'))).toBe('all');
  });
});

describe('permissionsSubtitle', () => {
  it('names the outing, its short day and the time it leaves', () => {
    expect(permissionsSubtitle('Salida al Parque Rodó', at(30, 10, 0))).toBe('Salida al Parque Rodó · jue 30 · 10:00');
  });
});

describe('isOutingDay', () => {
  it('starts at 7:00 of the outing day', () => {
    expect(isOutingDay(at(30, 10, 0), new Date(2025, 9, 30, 7, 0))).toBe(true);
  });

  it('is not yet the outing day before 7:00', () => {
    expect(isOutingDay(at(30, 10, 0), new Date(2025, 9, 30, 6, 59))).toBe(false);
  });

  it('stays the outing day after it leaves, until the day ends', () => {
    expect(isOutingDay(at(30, 10, 0), new Date(2025, 9, 30, 23, 0))).toBe(true);
  });

  it('is not the outing day the day before or after', () => {
    expect(isOutingDay(at(30, 10, 0), new Date(2025, 9, 29, 12, 0))).toBe(false);
    expect(isOutingDay(at(30, 10, 0), new Date(2025, 9, 31, 8, 0))).toBe(false);
  });
});

describe('outingDaySubtitle', () => {
  it('says today with the times they leave and come back', () => {
    expect(outingDaySubtitle(at(30, 10, 0), at(30, 12, 0))).toBe('Hoy · salen 10:00 · vuelven 12:00');
  });
});

describe('outing day rows', () => {
  it('drops the weekday from the answer time', () => {
    const rows = childPermissionRows([answer('sofia', 'authorized', at(24, 9, 40))], [child('sofia', 'Sofía')], VERSION, { withWeekday: false });

    expect(rows[0].meta).toBe('Carla (madre) · 24/10 9:40');
  });

  it('names every child who does not go: declined, withdrawn and pending, in list order', () => {
    const rows = childPermissionRows(
      [
        answer('sofia', 'authorized', at(24, 9, 40)),
        answer('valentina', 'pending', at(24, 8, 0)),
        answer('mateo', 'withdrawn', at(27, 8, 40)),
        answer('tomas', 'declined', at(25, 11, 20)),
      ],
      [child('sofia', 'Sofía', 'Acosta'), child('valentina', 'Valentina', 'Méndez'), child('mateo', 'Mateo', 'Rodríguez'), child('tomas', 'Tomás', 'Ruiz')],
      VERSION,
    );

    expect(stayingNames(rows)).toEqual(['Tomás Ruiz', 'Mateo Rodríguez', 'Valentina Méndez']);
  });
});

describe('outing day copy', () => {
  it('counts the children who do not go', () => {
    expect(noGoTitle(5)).toBe('5 niños no salen');
  });

  it('uses the singular for one child', () => {
    expect(noGoTitle(1)).toBe('1 niño no sale');
  });

  it('heads the list with the children who go', () => {
    expect(goingHeading(21)).toBe('Salen (21)');
  });
});
