import {
  birthdaysToday,
  buildRoomCards,
  groupMetaLine,
  hasNoTeacher,
  joinNames,
  noTeacherGroupLine,
  noTeacherGroups,
  noTeacherRosterLine,
  roomTitleAge,
  type DirectorRoomsInput,
} from '../director-rooms';

const TODAY = new Date(2026, 9, 24);

const MORNING = { id: 'am', name: 'morning' as const };
const AFTERNOON = { id: 'pm', name: 'afternoon' as const };

function input(overrides: Partial<DirectorRoomsInput> = {}): DirectorRoomsInput {
  return {
    rooms: [
      { id: 'sala-10', name: 'Sala 10', description: null },
      { id: 'sala-2', name: 'Sala 2', description: '2 años' },
    ],
    shifts: [AFTERNOON, MORNING],
    enrollments: [],
    assignments: [],
    ...overrides,
  };
}

describe('buildRoomCards', () => {
  it('orders the rooms by name with numbers read as numbers', () => {
    const cards = buildRoomCards(input());

    expect(cards.map((card) => card.name)).toEqual(['Sala 2', 'Sala 10']);
  });

  it('gives every room one group per nursery shift, morning first', () => {
    const [card] = buildRoomCards(input());

    expect(card.groups.map((group) => group.shift)).toEqual(['morning', 'afternoon']);
    expect(card.groups[0].label).toBe('Sala 2 · Matutino');
  });

  it('counts each child once per group', () => {
    const enrollments = [
      { childId: 'mateo', roomId: 'sala-2', shiftId: 'am', firstName: 'Mateo', birthDate: null },
      { childId: 'mateo', roomId: 'sala-2', shiftId: 'am', firstName: 'Mateo', birthDate: null },
      { childId: 'mateo', roomId: 'sala-2', shiftId: 'pm', firstName: 'Mateo', birthDate: null },
      { childId: 'bruno', roomId: 'sala-2', shiftId: 'am', firstName: 'Bruno', birthDate: null },
    ];

    const [card] = buildRoomCards(input({ enrollments }));

    expect(card.groups.map((group) => group.childrenCount)).toEqual([2, 1]);
  });

  it('lists the first names of the group teachers once each, leaving inactive teachers out', () => {
    const assignments = [
      { teacherId: 'sofia', roomId: 'sala-2', shiftId: 'am', firstName: 'Sofía', isActive: true },
      { teacherId: 'carolina', roomId: 'sala-2', shiftId: 'am', firstName: 'Carolina', isActive: true },
      { teacherId: 'sofia', roomId: 'sala-2', shiftId: 'am', firstName: 'Sofía', isActive: true },
      { teacherId: 'ana', roomId: 'sala-2', shiftId: 'am', firstName: 'Ana', isActive: false },
    ];

    const [card] = buildRoomCards(input({ assignments }));

    expect(card.groups[0].teacherNames).toEqual(['Sofía', 'Carolina']);
  });

  it('keeps a room with no shifts in the nursery, without groups', () => {
    const cards = buildRoomCards(input({ shifts: [] }));

    expect(cards[0].groups).toEqual([]);
  });
});

describe('roomTitleAge', () => {
  it('shows the room description as its age', () => {
    expect(roomTitleAge('2 años')).toBe('· 2 años');
  });

  it('shows nothing without a description', () => {
    expect(roomTitleAge(null)).toBeNull();
    expect(roomTitleAge('  ')).toBeNull();
  });
});

describe('joinNames', () => {
  it('joins one, two and three names', () => {
    expect(joinNames(['Sofía'])).toBe('Sofía');
    expect(joinNames(['Sofía', 'Carolina'])).toBe('Sofía y Carolina');
    expect(joinNames(['Julia', 'Paula', 'Ana'])).toBe('Julia, Paula y Ana');
  });
});

describe('groupMetaLine', () => {
  it('names the children count and the teachers', () => {
    expect(groupMetaLine({ childrenCount: 15, teacherNames: ['Sofía', 'Carolina'] })).toBe('15 niños · Sofía y Carolina');
  });

  it('shows only the children without teachers, in singular for one', () => {
    expect(groupMetaLine({ childrenCount: 1, teacherNames: [] })).toBe('1 niño');
  });
});

describe('groups without teacher', () => {
  it('flags a group with children and no teacher', () => {
    expect(hasNoTeacher({ childrenCount: 9, teacherNames: [] })).toBe(true);
  });

  it('does not flag an empty group or one with a teacher', () => {
    expect(hasNoTeacher({ childrenCount: 0, teacherNames: [] })).toBe(false);
    expect(hasNoTeacher({ childrenCount: 9, teacherNames: ['Rosario'] })).toBe(false);
  });

  it('collects them across rooms in card order', () => {
    const enrollments = [
      { childId: 'lucas', roomId: 'sala-10', shiftId: 'pm', firstName: 'Lucas', birthDate: null },
      { childId: 'mateo', roomId: 'sala-2', shiftId: 'am', firstName: 'Mateo', birthDate: null },
    ];

    const groups = noTeacherGroups(buildRoomCards(input({ enrollments })));

    expect(groups.map((group) => group.label)).toEqual(['Sala 2 · Matutino', 'Sala 10 · Vespertino']);
  });

  it('says which group has no teacher', () => {
    expect(noTeacherGroupLine('Sala 4 · Vespertino')).toBe('Sala 4 · Vespertino no tiene maestra.');
  });

  it('tells the group view that nobody can log the day of its children', () => {
    expect(noTeacherRosterLine(9)).toBe('Sin maestra. Nadie puede registrar el día de estos 9 niños.');
    expect(noTeacherRosterLine(1)).toBe('Sin maestra. Nadie puede registrar el día de este niño.');
  });
});

describe('birthdaysToday', () => {
  it('lists each child with a birthday today once, with age and first group', () => {
    const enrollments = [
      { childId: 'valentina', roomId: 'sala-2', shiftId: 'am', firstName: 'Valentina', birthDate: '2023-10-24' },
      { childId: 'valentina', roomId: 'sala-2', shiftId: 'pm', firstName: 'Valentina', birthDate: '2023-10-24' },
      { childId: 'bruno', roomId: 'sala-2', shiftId: 'am', firstName: 'Bruno', birthDate: '2023-10-28' },
    ];

    const birthdays = birthdaysToday(buildRoomCards(input({ enrollments })), enrollments, TODAY);

    expect(birthdays).toEqual([{ childId: 'valentina', firstName: 'Valentina', detail: '3 años · Sala 2 · Matutino' }]);
  });

  it('is empty when nobody has a birthday today', () => {
    expect(birthdaysToday([], [], TODAY)).toEqual([]);
  });
});
