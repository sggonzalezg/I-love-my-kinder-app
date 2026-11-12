import { defaultDraft } from '@/lib/routine';

import { initialRoutineLogState, ROUTINE_LOG_ACTIONS, routineLogReducer, type RoutineLogState } from '../routine-log-reducer';

const started = (): RoutineLogState =>
  routineLogReducer(initialRoutineLogState(3), { type: ROUTINE_LOG_ACTIONS.DRAFT_STARTED, childId: 'bruno', draft: defaultDraft('morning', 'diaper') });

describe('routineLogReducer (T4)', () => {
  it('opens on the requested child with nothing loaded yet', () => {
    expect(initialRoutineLogState(3)).toMatchObject({ index: 3, drafts: {}, hygieneType: 'pee', sheet: null, showRangeError: false, toast: null });
  });

  it('keeps a draft already started when the child comes back', () => {
    const state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.NOTE_CHANGED, childId: 'bruno', notes: 'Pintamos' });
    const again = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.DRAFT_STARTED, childId: 'bruno', draft: defaultDraft('morning', null) });
    expect(again.drafts.bruno.notes).toBe('Pintamos');
  });

  it('chooses a meal amount', () => {
    const state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.MEAL_CHOSEN, childId: 'bruno', meal: 'lunch', amount: 'half' });
    expect(state.drafts.bruno.meals).toEqual({ breakfast: 'all', lunch: 'half' });
  });

  it('sets the rest times, and "No durmió" toggles', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.REST_SET, childId: 'bruno', field: 'restStart', time: '12:30' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.NO_SLEEP_TOGGLED, childId: 'bruno' });
    expect(state.drafts.bruno).toMatchObject({ restStart: '12:30', noRest: true });
    expect(routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.NO_SLEEP_TOGGLED, childId: 'bruno' }).drafts.bruno.noRest).toBe(false);
  });

  it('adds a hygiene entry with the chosen kind and type, closes the sheet and goes back to Pis', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.HYGIENE_KIND_CHOSEN, childId: 'bruno', kind: 'bathroom' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.HYGIENE_TYPE_CHOSEN, hygieneType: 'poop' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.SHEET_OPENED, sheet: { purpose: 'hygieneAdd', time: '10:27' } });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: 'bruno', time: '10:27' });
    expect(state.drafts.bruno.hygiene).toEqual([{ kind: 'bathroom', type: 'poop', time: '10:27' }]);
    expect(state.sheet).toBeNull();
    expect(state.hygieneType).toBe('pee');
  });

  it('changes the time of a logged entry, keeping the list in time order', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: 'bruno', time: '10:10' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: 'bruno', time: '12:15' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.HYGIENE_RETIMED, childId: 'bruno', entryIndex: 1, time: '09:00' });
    expect(state.drafts.bruno.hygiene.map((entry) => entry.time)).toEqual(['09:00', '10:10']);
  });

  it('deletes a logged entry', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.HYGIENE_ADDED, childId: 'bruno', time: '10:10' });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.HYGIENE_REMOVED, childId: 'bruno', entryIndex: 0 });
    expect(state.drafts.bruno.hygiene).toEqual([]);
  });

  it('moves the time in an open sheet and closes it', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.SHEET_OPENED, sheet: { purpose: 'restEnd', time: '13:40' } });
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.SHEET_TIME_CHANGED, time: '13:45' });
    expect(state.sheet).toEqual({ purpose: 'restEnd', time: '13:45' });
    expect(routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.SHEET_CLOSED }).sheet).toBeNull();
  });

  it('shows the rest error when saving is blocked, and clears it on the next child', () => {
    let state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.SAVE_BLOCKED });
    expect(state.showRangeError).toBe(true);
    state = routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.CHILD_SHOWN, index: 4, toast: 'Guardado · Bruno' });
    expect(state).toMatchObject({ index: 4, showRangeError: false, toast: 'Guardado · Bruno' });
  });

  it('hides the toast', () => {
    const state = routineLogReducer(started(), { type: ROUTINE_LOG_ACTIONS.CHILD_SHOWN, index: 4, toast: 'Guardado · Bruno' });
    expect(routineLogReducer(state, { type: ROUTINE_LOG_ACTIONS.TOAST_HIDDEN }).toast).toBeNull();
  });
});
