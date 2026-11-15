import { CHILD_FILE_PARTS } from '@/lib/director-child-file';

import { CHILD_FILE_ACTIONS, INITIAL_CHILD_FILE_STATE, childFileReducer } from '../child-file-reducer';

describe('childFileReducer', () => {
  it('starts on Datos, editing, with no edits', () => {
    const state = INITIAL_CHILD_FILE_STATE;

    expect([state.part, state.status, state.edits, state.showErrors, state.saveFailed]).toEqual([CHILD_FILE_PARTS.data, 'editing', {}, false, false]);
  });

  it('switches the part and keeps the edits', () => {
    const edited = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'Mateo' });
    const state = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect([state.part, state.edits.firstName]).toEqual([CHILD_FILE_PARTS.health, 'Mateo']);
  });

  it('hides the field errors on the new part', () => {
    const refused = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SUBMIT_REFUSED });
    const state = childFileReducer(refused, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect(state.showErrors).toBe(false);
  });

  it('stores an edited field', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'allergies', value: 'Maní' });

    expect(state.edits).toEqual({ allergies: 'Maní' });
  });

  it('shows the field errors after a refused save', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SUBMIT_REFUSED });

    expect(state.showErrors).toBe(true);
  });

  it('marks saving', () => {
    const state = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the edits after a failed save', () => {
    const edited = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'lastName', value: 'Sosa' });
    const saving = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });
    const failed = childFileReducer(saving, { type: CHILD_FILE_ACTIONS.SAVE_FAILED });

    expect([failed.status, failed.edits.lastName, failed.saveFailed]).toEqual(['editing', 'Sosa', true]);
  });

  it('clears the save failure once a field changes', () => {
    const failed = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_FAILED });
    const edited = childFileReducer(failed, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'M' });

    expect(edited.saveFailed).toBe(false);
  });

  it('ignores edits and part changes while saving', () => {
    const saving = childFileReducer(INITIAL_CHILD_FILE_STATE, { type: CHILD_FILE_ACTIONS.SAVE_STARTED });
    const edited = childFileReducer(saving, { type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'M' });
    const switched = childFileReducer(edited, { type: CHILD_FILE_ACTIONS.PART_CHOSEN, part: CHILD_FILE_PARTS.health });

    expect(switched).toBe(saving);
  });
});
