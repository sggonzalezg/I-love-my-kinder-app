import { INITIAL_PERSON_FORM_STATE, PERSON_FORM_ACTIONS, personFormReducer } from '../person-form-reducer';

describe('personFormReducer', () => {
  it('starts editing, with no edits and no errors shown', () => {
    expect(INITIAL_PERSON_FORM_STATE).toEqual({ edits: {}, status: 'editing', showErrors: false, saveFailed: false });
  });

  it('stores an edited field', () => {
    const state = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.FIELD_CHANGED, field: 'name', value: 'Marta' });

    expect(state.edits).toEqual({ name: 'Marta' });
  });

  it('shows the field errors after a refused save', () => {
    const state = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.SUBMIT_REFUSED });

    expect(state.showErrors).toBe(true);
  });

  it('marks saving', () => {
    const state = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the values when the save fails', () => {
    const edited = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.FIELD_CHANGED, field: 'phone', value: '099 300 120' });
    const saving = personFormReducer(edited, { type: PERSON_FORM_ACTIONS.SAVE_STARTED });
    const state = personFormReducer(saving, { type: PERSON_FORM_ACTIONS.SAVE_FAILED });

    expect([state.status, state.saveFailed, state.edits.phone]).toEqual(['editing', true, '099 300 120']);
  });

  it('clears the save failure on the next edit', () => {
    const failed = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.SAVE_FAILED });
    const state = personFormReducer(failed, { type: PERSON_FORM_ACTIONS.FIELD_CHANGED, field: 'name', value: 'Ana' });

    expect(state.saveFailed).toBe(false);
  });

  it('takes no edits while saving', () => {
    const saving = personFormReducer(INITIAL_PERSON_FORM_STATE, { type: PERSON_FORM_ACTIONS.SAVE_STARTED });
    const state = personFormReducer(saving, { type: PERSON_FORM_ACTIONS.FIELD_CHANGED, field: 'name', value: 'Ana' });

    expect(state).toBe(saving);
  });
});
