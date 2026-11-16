import { GROUP_FORM_ACTIONS, INITIAL_GROUP_FORM_STATE, groupFormReducer } from '../group-form-reducer';

describe('groupFormReducer', () => {
  it('starts editing, with no edits and no errors shown', () => {
    expect(INITIAL_GROUP_FORM_STATE).toEqual({ edits: {}, status: 'editing', showErrors: false, saveError: null });
  });

  it('stores a chosen room', () => {
    const state = groupFormReducer(INITIAL_GROUP_FORM_STATE, { type: GROUP_FORM_ACTIONS.FIELD_CHANGED, field: 'roomId', value: 'room-2' });

    expect(state.edits).toEqual({ roomId: 'room-2' });
  });

  it('shows the field errors after a refused save', () => {
    expect(groupFormReducer(INITIAL_GROUP_FORM_STATE, { type: GROUP_FORM_ACTIONS.SUBMIT_REFUSED }).showErrors).toBe(true);
  });

  it('marks saving', () => {
    expect(groupFormReducer(INITIAL_GROUP_FORM_STATE, { type: GROUP_FORM_ACTIONS.SAVE_STARTED }).status).toBe('saving');
  });

  it('keeps the choices and shows the message when the save fails', () => {
    const edited = groupFormReducer(INITIAL_GROUP_FORM_STATE, { type: GROUP_FORM_ACTIONS.FIELD_CHANGED, field: 'shiftId', value: 'shift-pm' });
    const saving = groupFormReducer(edited, { type: GROUP_FORM_ACTIONS.SAVE_STARTED });
    const state = groupFormReducer(saving, { type: GROUP_FORM_ACTIONS.SAVE_FAILED, message: 'Ya está en ese turno.' });

    expect(state).toEqual({ edits: { shiftId: 'shift-pm' }, status: 'editing', showErrors: true, saveError: 'Ya está en ese turno.' });
  });

  it('clears the save message on a new choice', () => {
    const failed = { ...INITIAL_GROUP_FORM_STATE, saveError: 'Ya está en ese turno.' };

    expect(groupFormReducer(failed, { type: GROUP_FORM_ACTIONS.FIELD_CHANGED, field: 'shiftId', value: 'shift-am' }).saveError).toBeNull();
  });

  it('ignores choices while saving', () => {
    const saving = groupFormReducer(INITIAL_GROUP_FORM_STATE, { type: GROUP_FORM_ACTIONS.SAVE_STARTED });

    expect(groupFormReducer(saving, { type: GROUP_FORM_ACTIONS.FIELD_CHANGED, field: 'roomId', value: 'room-10' })).toBe(saving);
  });
});
