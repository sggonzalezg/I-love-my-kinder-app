import {
  bandLine,
  dayGroups,
  dayStrip,
  emptyDayTitle,
  groupTeachers,
  hygieneBlocks,
  initialGroupKey,
  mealRows,
  notYetLine,
  restDuration,
  routineEntryCount,
  routineTeacher,
  sealLine,
  sealTitle,
  type DayGroup,
  type DayRoutine,
} from '../child-day';

const FRIDAY = new Date(2025, 9, 24, 10, 0);

const MORNING: DayGroup = { key: 'r2:s-am', roomId: 'r2', roomName: 'Sala 2', shiftId: 's-am', shift: 'morning', startTime: '08:00:00', endTime: '12:30:00' };
const AFTERNOON: DayGroup = { key: 'r2:s-pm', roomId: 'r2', roomName: 'Sala 2', shiftId: 's-pm', shift: 'afternoon', startTime: '13:00:00', endTime: '18:00:00' };

function routine(overrides: Partial<DayRoutine> = {}): DayRoutine {
  return {
    roomId: 'r2',
    shiftId: 's-am',
    meals: {},
    restStart: null,
    restEnd: null,
    noSleep: false,
    hygiene: [],
    notes: null,
    previousValues: {},
    createdAt: '2025-10-24T12:40:00',
    correctedAt: null,
    loggedByLabel: 'Maestra Sofía',
    ...overrides,
  };
}

describe('dayStrip', () => {
  it('starts on today and goes back one day at a time', () => {
    const days = dayStrip(FRIDAY, 4);
    expect(days.map((day) => day.label)).toEqual(['Hoy', 'Ayer', 'Mié 22', 'Mar 21']);
  });

  it('keys each day by its ISO date', () => {
    expect(dayStrip(FRIDAY, 2).map((day) => day.isoDate)).toEqual(['2025-10-24', '2025-10-23']);
  });
});

describe('initialGroupKey', () => {
  it('opens on the afternoon group from 13:00', () => {
    expect(initialGroupKey([MORNING, AFTERNOON], new Date(2025, 9, 24, 13, 0))).toBe(AFTERNOON.key);
  });

  it('opens on the morning group before 13:00', () => {
    expect(initialGroupKey([MORNING, AFTERNOON], FRIDAY)).toBe(MORNING.key);
  });

  it('opens on the only group whatever the hour', () => {
    expect(initialGroupKey([AFTERNOON], FRIDAY)).toBe(AFTERNOON.key);
  });

  it('is null without groups', () => {
    expect(initialGroupKey([], FRIDAY)).toBeNull();
  });
});

describe('dayGroups', () => {
  it('keeps the open groups in morning then afternoon order', () => {
    expect(dayGroups([AFTERNOON, MORNING], []).map((group) => group.key)).toEqual([MORNING.key, AFTERNOON.key]);
  });

  it('adds the group of a routine the child no longer belongs to', () => {
    const oldGroup = { ...MORNING, key: 'r1:s-am', roomId: 'r1', roomName: 'Sala 1' };
    expect(dayGroups([AFTERNOON], [oldGroup]).map((group) => group.key)).toEqual(['r1:s-am', AFTERNOON.key]);
  });

  it('does not repeat a group that is both open and in a routine', () => {
    expect(dayGroups([MORNING], [MORNING])).toHaveLength(1);
  });
});

describe('bandLine', () => {
  it('says the hours and the teacher', () => {
    expect(bandLine(MORNING, 'Maestra Sofía', false)).toBe('8:00 a 12:30 · Maestra Sofía');
  });

  it('puts the room first when the title line does not name it', () => {
    expect(bandLine(AFTERNOON, 'Maestra Carolina', true)).toBe('Sala 2 · 13:00 a 18:00 · Maestra Carolina');
  });

  it('leaves the teacher out when the group has none', () => {
    expect(bandLine(MORNING, null, false)).toBe('8:00 a 12:30');
  });
});

describe('restDuration', () => {
  it('shows hours and minutes', () => {
    expect(restDuration('12:30:00', '13:50:00')).toEqual({ value: '1 h 20', unit: 'min' });
  });

  it('shows only minutes under an hour', () => {
    expect(restDuration('12:30', '13:15')).toEqual({ value: '45', unit: 'min' });
  });

  it('shows whole hours', () => {
    expect(restDuration('12:00', '14:00')).toEqual({ value: '2', unit: 'h' });
  });

  it('is null while the child is still asleep', () => {
    expect(restDuration('12:30', null)).toBeNull();
  });
});

describe('mealRows', () => {
  it('lists the logged meals in their order with amount and dots, without a time', () => {
    const rows = mealRows(routine({ meals: { lunch: 'half', breakfast: 'all' } }));
    expect(rows).toEqual([
      { key: 'breakfast', label: 'Desayuno', amount: 'Todo', dots: 4, updated: null },
      { key: 'lunch', label: 'Almuerzo', amount: 'La mitad', dots: 2, updated: null },
    ]);
  });

  it('says when a meal was corrected and what it was before', () => {
    const corrected = routine({
      meals: { lunch: 'little' },
      previousValues: { meals: { previous_value: { lunch: 'half' } } },
      correctedAt: '2025-10-23T14:05:00',
    });
    expect(mealRows(corrected)[0].updated).toBe('Actualizado 14:05 · antes "La mitad"');
  });

  it('does not mark a meal that kept its value through a correction', () => {
    const corrected = routine({
      meals: { breakfast: 'all', lunch: 'little' },
      previousValues: { meals: { previous_value: { breakfast: 'all', lunch: 'half' } } },
      correctedAt: '2025-10-23T14:05:00',
    });
    expect(mealRows(corrected)[0].updated).toBeNull();
  });
});

describe('hygieneBlocks', () => {
  it('shows only the kinds that were logged, sorted by time', () => {
    const blocks = hygieneBlocks([
      { kind: 'bathroom', type: 'poop', time: '11:50' },
      { kind: 'bathroom', type: 'pee', time: '9:40' },
    ]);
    expect(blocks).toEqual([{ kind: 'bathroom', title: 'Baño', count: '2 veces', rows: [{ time: '9:40', label: 'Pis' }, { time: '11:50', label: 'Caca' }] }]);
  });

  it('shows Pañales before Baño for a child in transition', () => {
    const blocks = hygieneBlocks([
      { kind: 'bathroom', type: 'pee', time: '09:40' },
      { kind: 'diaper', type: 'poop', time: '12:15' },
    ]);
    expect(blocks.map((block) => [block.title, block.count])).toEqual([
      ['Pañales', '1 cambio'],
      ['Baño', '1 vez'],
    ]);
  });

  it('counts diaper changes in plural', () => {
    const blocks = hygieneBlocks([
      { kind: 'diaper', type: 'pee', time: '10:10' },
      { kind: 'diaper', type: 'dry', time: '12:15' },
    ]);
    expect(blocks[0].count).toBe('2 cambios');
  });
});

describe('routineEntryCount', () => {
  it('counts meals, hygiene changes, the rest and the note', () => {
    const full = routine({
      meals: { breakfast: 'all', lunch: 'half' },
      restStart: '12:30',
      restEnd: '13:50',
      hygiene: [
        { kind: 'diaper', type: 'pee', time: '10:10' },
        { kind: 'diaper', type: 'poop', time: '12:15' },
      ],
      notes: 'Pintamos',
    });
    expect(routineEntryCount(full)).toBe(6);
  });

  it('counts a day without sleep as a rest entry', () => {
    expect(routineEntryCount(routine({ noSleep: true }))).toBe(1);
  });
});

describe('sealTitle', () => {
  it('names the teacher and the shift', () => {
    expect(sealTitle('Maestra Sofía', 'morning')).toBe('Maestra Sofía firmó el turno matutino');
  });

  it('falls back to la maestra', () => {
    expect(sealTitle(null, 'afternoon')).toBe('La maestra firmó el turno vespertino');
  });
});

describe('sealLine', () => {
  it('says today, the time and the entries', () => {
    expect(sealLine(routine({ meals: { breakfast: 'all' }, notes: 'Hola' }), new Date(2025, 9, 24), FRIDAY)).toBe('Hoy a las 12:40 · 2 registros');
  });

  it('uses the singular for one entry', () => {
    expect(sealLine(routine({ notes: 'Hola' }), new Date(2025, 9, 24), FRIDAY)).toBe('Hoy a las 12:40 · 1 registro');
  });

  it('names the weekday of an older day and the correction time', () => {
    const corrected = routine({ createdAt: '2025-10-22T12:50:00', correctedAt: '2025-10-22T14:05:00' });
    expect(sealLine(corrected, new Date(2025, 9, 22), FRIDAY)).toBe('Miércoles a las 12:50 · actualizado a las 14:05');
  });

  it('says ayer for yesterday', () => {
    expect(sealLine(routine({ notes: 'Hola' }), new Date(2025, 9, 23), FRIDAY)).toBe('Ayer a las 12:40 · 1 registro');
  });
});

describe('notYetLine', () => {
  it('says when the shift usually has it ready', () => {
    expect(notYetLine('Lucía', AFTERNOON)).toBe('Te avisamos apenas esté. Lucía va en el turno vespertino: suele estar a las 18:00.');
  });
});

describe('emptyDayTitle', () => {
  it('names the weekday', () => {
    expect(emptyDayTitle(new Date(2025, 9, 19))).toBe('No hay registro del domingo');
  });
});

describe('groupTeachers', () => {
  it('lists the teachers of the group with their labels', () => {
    const teachers = [
      { id: 't0', first_name: 'Ana', last_name: 'Pérez', role: 'Asistente', photo_path: null },
      { id: 't1', first_name: 'Sofía', last_name: 'Gómez', role: 'Maestra', photo_path: 'teachers/t1.jpg' },
    ];
    expect(groupTeachers(teachers)).toEqual([{ label: 'Maestra Sofía', initials: 'SG', photoPath: 'teachers/t1.jpg' }]);
  });

  it('is empty when the group has no teacher', () => {
    expect(groupTeachers([{ id: 't0', first_name: 'Ana', last_name: 'Pérez', role: 'Asistente', photo_path: null }])).toEqual([]);
  });
});

describe('routineTeacher', () => {
  const SOFIA = { label: 'Maestra Sofía', initials: 'SG', photoPath: 'teachers/t1.jpg' };
  const ANA = { label: 'Maestra Ana', initials: 'AP', photoPath: null };

  it('names the teacher who logged the routine, with her photo from the group', () => {
    expect(routineTeacher(routine({ loggedByLabel: 'Maestra Ana' }), [SOFIA, ANA])).toEqual(ANA);
  });

  it('keeps the stored label when the one who logged it is not in the group', () => {
    expect(routineTeacher(routine({ loggedByLabel: 'Dirección' }), [SOFIA])).toEqual({ label: 'Dirección', initials: 'D', photoPath: null });
  });

  it('falls back to the first teacher of the group when there is no routine yet', () => {
    expect(routineTeacher(null, [SOFIA, ANA])).toEqual(SOFIA);
  });

  it('is null with no routine and no teacher', () => {
    expect(routineTeacher(null, [])).toBeNull();
  });
});
