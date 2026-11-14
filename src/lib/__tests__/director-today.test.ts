import {
  missingLine,
  noTeacherLine,
  startsAtLine,
  supervisionChipVariant,
  supervisionGroups,
  supervisionTotals,
  type EnrolledChild,
  type GroupKeyRef,
} from '../director-today';

const MORNING = { shiftId: 'am', shift: 'morning' as const, shiftStartTime: '08:00:00' };
const AFTERNOON = { shiftId: 'pm', shift: 'afternoon' as const, shiftStartTime: '13:00:00' };
const ROOM_1 = { roomId: 'r1', roomName: 'Sala 1' };
const ROOM_2 = { roomId: 'r2', roomName: 'Sala 2' };
const ROOM_10 = { roomId: 'r10', roomName: 'Sala 10' };
const MID_MORNING = new Date(2026, 9, 24, 10, 30);

function child(childId: string, name: string, group: Omit<EnrolledChild, 'childId' | 'name'>): EnrolledChild {
  return { childId, name, ...group };
}

const teacherOf = (roomId: string, shiftId: string): GroupKeyRef => ({ roomId, shiftId });

describe('supervisionGroups', () => {
  it('counts the children of a group and those with today’s routine', () => {
    const enrolled = [
      child('bruno', 'Bruno García', { ...ROOM_2, ...MORNING }),
      child('lucia', 'Lucía Pereira', { ...ROOM_2, ...MORNING }),
      child('mateo', 'Mateo Silva', { ...ROOM_2, ...MORNING }),
    ];
    const routines = [{ childId: 'mateo', roomId: 'r2', shiftId: 'am' }];

    const [group] = supervisionGroups(enrolled, [teacherOf('r2', 'am')], routines, MID_MORNING);

    expect(group).toMatchObject({ label: 'Sala 2 · Matutino', total: 3, logged: 1, missingNames: ['Bruno García', 'Lucía Pereira'] });
  });

  it('counts a routine only for the group it was saved in', () => {
    const enrolled = [child('bruno', 'Bruno García', { ...ROOM_1, ...MORNING }), child('bruno', 'Bruno García', { ...ROOM_1, ...AFTERNOON })];
    const routines = [{ childId: 'bruno', roomId: 'r1', shiftId: 'am' }];

    const groups = supervisionGroups(enrolled, [teacherOf('r1', 'am'), teacherOf('r1', 'pm')], routines, MID_MORNING);

    expect(groups.map((group) => group.logged)).toEqual([1, 0]);
  });

  it('lists morning groups first and then rooms in natural order', () => {
    const enrolled = [
      child('a', 'Ana Ruiz', { ...ROOM_1, ...AFTERNOON }),
      child('b', 'Beto Ruiz', { ...ROOM_10, ...MORNING }),
      child('c', 'Carla Ruiz', { ...ROOM_2, ...MORNING }),
    ];

    const groups = supervisionGroups(enrolled, [], [], MID_MORNING);

    expect(groups.map((group) => group.label)).toEqual(['Sala 2 · Matutino', 'Sala 10 · Matutino', 'Sala 1 · Vespertino']);
  });

  it('marks a group without an open teacher assignment', () => {
    const enrolled = [child('a', 'Ana Ruiz', { ...ROOM_1, ...MORNING }), child('b', 'Beto Ruiz', { ...ROOM_2, ...MORNING })];

    const groups = supervisionGroups(enrolled, [teacherOf('r2', 'am')], [], MID_MORNING);

    expect(groups.map((group) => group.hasTeacher)).toEqual([false, true]);
  });

  it('says a group has not started before its shift starts and nothing is logged', () => {
    const enrolled = [child('a', 'Ana Ruiz', { ...ROOM_1, ...AFTERNOON })];

    const [group] = supervisionGroups(enrolled, [teacherOf('r1', 'pm')], [], MID_MORNING);

    expect(group).toMatchObject({ notStarted: true, startTime: '13:00' });
  });

  it('says a group has started once its shift start passed', () => {
    const enrolled = [child('a', 'Ana Ruiz', { ...ROOM_1, ...AFTERNOON })];

    const [group] = supervisionGroups(enrolled, [teacherOf('r1', 'pm')], [], new Date(2026, 9, 24, 13, 5));

    expect(group.notStarted).toBe(false);
  });
});

describe('supervisionTotals', () => {
  it('adds the logged and total children of every group', () => {
    const totals = supervisionTotals([
      { logged: 14, total: 14 },
      { logged: 12, total: 15 },
    ]);

    expect(totals).toEqual({ logged: 26, total: 29 });
  });
});

describe('supervisionChipVariant', () => {
  it('is ok when every child is logged', () => {
    expect(supervisionChipVariant({ logged: 14, total: 14, notStarted: false })).toBe('ok');
  });

  it('is grey before the shift starts', () => {
    expect(supervisionChipVariant({ logged: 0, total: 12, notStarted: true })).toBe('grey');
  });

  it('is blue while children are missing', () => {
    expect(supervisionChipVariant({ logged: 12, total: 15, notStarted: false })).toBe('blue');
  });
});

describe('supervision copy', () => {
  it('names the missing children', () => {
    expect(missingLine(['Bruno García', 'Valentín Rossi'])).toBe('Faltan: Bruno García, Valentín Rossi');
  });

  it('says when the shift starts', () => {
    expect(startsAtLine('13:00')).toBe('Empieza a las 13:00');
  });

  it('says nobody can log the day of the group’s children', () => {
    expect(noTeacherLine(9)).toBe('Nadie puede registrar el día de estos 9 niños.');
  });

  it('says nobody can log the day of a single child', () => {
    expect(noTeacherLine(1)).toBe('Nadie puede registrar el día de este niño.');
  });
});
