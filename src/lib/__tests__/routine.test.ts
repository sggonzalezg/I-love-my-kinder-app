import {
  addHygiene,
  defaultDraft,
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

  it('builds the save-routine payload, using the main meal for the single meals column', () => {
    const draft: RoutineDraft = {
      ...defaultDraft('morning', null),
      meals: { breakfast: 'all', lunch: 'half' },
      restStart: '12:30',
      restEnd: '13:50',
      notes: '  Jugó mucho  ',
    };
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's' });
    expect(payload).toMatchObject({
      childId: 'c',
      roomId: 'r',
      shiftId: 's',
      meals: 'half',
      mealDetails: { breakfast: 'all', lunch: 'half' },
      restStart: '12:30',
      restEnd: '13:50',
      notes: 'Jugó mucho',
    });
  });

  it('sends no rest times when the child did not sleep', () => {
    const draft = { ...defaultDraft('morning', null), noRest: true, restStart: '12:30' };
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's' });
    expect(payload.restStart).toBeNull();
    expect(payload.restEnd).toBeNull();
  });

  it('drops "dry" diaper entries the backend cannot store yet', () => {
    let draft = defaultDraft('morning', null);
    draft = addHygiene(draft, { kind: 'diaper', type: 'dry', time: '10:00' });
    draft = addHygiene(draft, { kind: 'diaper', type: 'pee', time: '11:00' });
    const payload = toSavePayload(draft, { childId: 'c', roomId: 'r', shiftId: 's' });
    expect(payload.hygiene).toEqual([{ kind: 'diaper', type: 'pee', time: '11:00' }]);
  });

  it('finds the first child not logged yet', () => {
    expect(nextPendingIndex([true, true, false, false])).toBe(2);
    expect(nextPendingIndex([true, true])).toBe(-1);
  });

  it('labels progress as "7 de 15"', () => {
    expect(progressLabel(7, 15)).toBe('7 de 15');
  });
});
