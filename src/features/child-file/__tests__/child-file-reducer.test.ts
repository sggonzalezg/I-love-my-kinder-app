import { CHILD_FILE_ACTIONS, childFileReducer, INITIAL_CHILD_FILE_STATE } from '../child-file-reducer';

describe('childFileReducer', () => {
  it('starts with every cédula hidden', () => {
    expect(INITIAL_CHILD_FILE_STATE.revealedIds).toEqual([]);
  });

  it('shows a cédula on its first toggle', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'marta' });

    expect(state.revealedIds).toEqual(['marta']);
  });

  it('hides a shown cédula on its second toggle and keeps the others', () => {
    const shown = { revealedIds: ['marta', 'laura'] };

    const state = childFileReducer(shown, { type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId: 'marta' });

    expect(state.revealedIds).toEqual(['laura']);
  });

  it('hides every cédula when the screen is left', () => {
    const shown = { revealedIds: ['marta', 'laura'] };

    const state = childFileReducer(shown, { type: CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN });

    expect(state.revealedIds).toEqual([]);
  });
});
