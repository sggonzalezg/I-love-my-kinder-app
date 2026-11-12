import {
  addHygiene,
  defaultDraft,
  draftFromRoutine,
  hasRestRangeError,
  lastHygieneKind,
  mealsForShift,
  nextPendingIndex,
  progressLabel,
  removeHygiene,
  toSavePayload,
  type RoutineDraft,
} from '../routine';

describe('routine logging (T4)', () => {
  it('matutino has Desayuno and Almuerzo; vespertino only Merienda (round 17)', () => {
    expect(mealsForShift('morning')).toEqual(['breakfast', 'lunch']);
    expect(mealsForShift('afternoon')).toEqual(['snack']);
  });

  it('starts every meal on "Todo" and hygiene on the kind last logged for the child', () => {
    const draft = defaultDraft('morning', 'bathroom');
    expect(draft.meals).toEqual({ breakfast: 'all', lunch: 'all' });
    expect(draft.hygieneKind).toBe('bathroom');
    expect(draft.hygiene).toEqual([]);
  });

  it('defaults hygiene to diaper when nothing was logged before', () => {
    expect(defaultDraft('afternoon', null).hygieneKind).toBe('diaper');
  });

  it('keeps hygiene entries sorted by time when adding', () => {
    let draft = defaultDraft('morning', null);
    draft = addHygiene(draft, { kind: 'diaper', type: 'pee', time: '10:27' });
    draft = addHygiene(draft, { kind: 'diaper', type: 'poop', time: '09:10' });
    expect(draft.hygiene.map((h) => h.time)).toEqual(['09:10', '10:27']);
  });

  it('removes a hygiene entry by index', () => {
    let draft = defaultDraft('morning', null);
    draft = addHygiene(draft, { kind: 'diaper', type: 'pee', time: '10:27' });
    expect(removeHygiene(draft, 0).hygiene).toEqual([]);
  });

  it('builds the save-routine payload with every meal of the shift and the rest times', () => {
    const draft: RoutineDraft = {
      ...defaultDraft('morning', null),
      meals: { breakfast: 'all', lunch: 'half' },
      restStart: '12:30',
      restEnd: '13:50',
      notes: '  Jugó mucho  ',
    };
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's', routineDate: '2026-11-12' });
    expect(payload).toEqual({
      childId: 'c',
      roomId: 'r',
      shiftId: 's',
      routineDate: '2026-11-12',
      meals: { breakfast: 'all', lunch: 'half' },
      rest: { start: '12:30', end: '13:50', noSleep: false },
      hygiene: [],
      notes: 'Jugó mucho',
    });
  });

  it('sends no rest times when the child did not sleep', () => {
    const draft = { ...defaultDraft('morning', null), noRest: true, restStart: '12:30' };
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's', routineDate: '2026-11-12' });
    expect(payload.rest).toEqual({ start: null, end: null, noSleep: true });
  });

  it('keeps "Seco" entries, which the backend stores since its routines step', () => {
    let draft = defaultDraft('morning', null);
    draft = addHygiene(draft, { kind: 'diaper', type: 'dry', time: '10:00' });
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's', routineDate: '2026-11-12' });
    expect(payload.hygiene).toEqual([{ kind: 'diaper', type: 'dry', time: '10:00' }]);
  });

  it('flags a rest that ends before it starts', () => {
    const draft = { ...defaultDraft('morning', null), restStart: '13:50', restEnd: '12:30' };
    expect(hasRestRangeError(draft)).toBe(true);
  });

  it('accepts a rest with only its start, or one that did not happen', () => {
    expect(hasRestRangeError({ ...defaultDraft('morning', null), restStart: '12:30' })).toBe(false);
    expect(hasRestRangeError({ ...defaultDraft('morning', null), restStart: '13:50', restEnd: '12:30', noRest: true })).toBe(false);
  });

  it('rebuilds the draft of a saved routine, with Postgres times cut to HH:MM', () => {
    const draft = draftFromRoutine(
      {
        meals: { snack: 'little' },
        rest_start_time: '15:05:00',
        rest_end_time: null,
        no_sleep: false,
        hygiene_entries: [{ kind: 'bathroom', type: 'pee', time: '16:10' }],
        notes: 'Bloques',
      },
      'afternoon',
    );
    expect(draft).toEqual({
      shift: 'afternoon',
      meals: { snack: 'little' },
      restStart: '15:05',
      restEnd: null,
      noRest: false,
      hygieneKind: 'bathroom',
      hygiene: [{ kind: 'bathroom', type: 'pee', time: '16:10' }],
      notes: 'Bloques',
    });
  });

  it('starts hygiene on the kind of the last entry logged', () => {
    expect(lastHygieneKind([{ kind: 'diaper', type: 'pee', time: '08:50' }, { kind: 'bathroom', type: 'poop', time: '09:40' }])).toBe('bathroom');
    expect(lastHygieneKind([])).toBeNull();
  });

  it('finds the first child not logged yet', () => {
    expect(nextPendingIndex([true, true, false, false])).toBe(2);
    expect(nextPendingIndex([true, true])).toBe(-1);
  });

  it('labels progress as "7 de 15"', () => {
    expect(progressLabel(7, 15)).toBe('7 de 15');
  });
});
