import { INITIAL_NEW_CHILD_FORM_STATE, NEW_CHILD_FORM_ACTIONS, newChildFormReducer } from '../new-child-form-reducer';

const TAKEN_ERROR = { field: 'nationalId' as const, message: 'Esa cédula ya es de otro niño del jardín.' };

describe('newChildFormReducer', () => {
  it('starts empty, editing and without errors', () => {
    const state = INITIAL_NEW_CHILD_FORM_STATE;

    expect([state.values.firstName, state.status, state.showErrors, state.saveError]).toEqual(['', 'editing', false, null]);
  });

  it('changes one field', () => {
    const state = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'Julieta' });

    expect(state.values.firstName).toBe('Julieta');
  });

  it('shows the field errors after a refused submit', () => {
    const state = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.SUBMIT_REFUSED });

    expect(state.showErrors).toBe(true);
  });

  it('marks saving', () => {
    const state = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the values and the error after a failed save', () => {
    const edited = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED, field: 'lastName', value: 'Sosa' });
    const saving = newChildFormReducer(edited, { type: NEW_CHILD_FORM_ACTIONS.SAVE_STARTED });
    const failed = newChildFormReducer(saving, { type: NEW_CHILD_FORM_ACTIONS.SAVE_FAILED, error: TAKEN_ERROR });

    expect([failed.status, failed.values.lastName, failed.saveError]).toEqual(['editing', 'Sosa', TAKEN_ERROR]);
  });

  it('clears the save error once a field changes', () => {
    const failed = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.SAVE_FAILED, error: TAKEN_ERROR });
    const edited = newChildFormReducer(failed, { type: NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED, field: 'nationalId', value: '1' });

    expect(edited.saveError).toBeNull();
  });

  it('ignores edits while saving', () => {
    const saving = newChildFormReducer(INITIAL_NEW_CHILD_FORM_STATE, { type: NEW_CHILD_FORM_ACTIONS.SAVE_STARTED });
    const state = newChildFormReducer(saving, { type: NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED, field: 'firstName', value: 'Ana' });

    expect(state.values.firstName).toBe('');
  });
});
