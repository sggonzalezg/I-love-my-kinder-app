import { ROOM_FORM_ACTIONS, initialRoomFormState, roomFormReducer } from '../room-form-reducer';

describe('roomFormReducer', () => {
  it('starts on the stored values', () => {
    const state = initialRoomFormState({ name: 'Sala 3', age: '3 años' });

    expect([state.values, state.status]).toEqual([{ name: 'Sala 3', age: '3 años' }, 'editing']);
  });

  it('changes one field and keeps the other', () => {
    const state = roomFormReducer(initialRoomFormState({ name: 'Sala 3', age: '3 años' }), {
      type: ROOM_FORM_ACTIONS.FIELD_CHANGED,
      field: 'name',
      value: 'Sala 4',
    });

    expect(state.values).toEqual({ name: 'Sala 4', age: '3 años' });
  });

  it('marks saving', () => {
    const state = roomFormReducer(initialRoomFormState({ name: 'Sala 3', age: '' }), { type: ROOM_FORM_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the values after a failed save', () => {
    const saving = roomFormReducer(initialRoomFormState({ name: 'Sala 3', age: '' }), { type: ROOM_FORM_ACTIONS.SAVE_STARTED });
    const failed = roomFormReducer(saving, { type: ROOM_FORM_ACTIONS.SAVE_FAILED });

    expect([failed.status, failed.values.name]).toEqual(['failed', 'Sala 3']);
  });

  it('clears the failure once a field changes', () => {
    const failed = roomFormReducer(initialRoomFormState({ name: 'Sala 3', age: '' }), { type: ROOM_FORM_ACTIONS.SAVE_FAILED });
    const edited = roomFormReducer(failed, { type: ROOM_FORM_ACTIONS.FIELD_CHANGED, field: 'age', value: '3 años' });

    expect(edited.status).toBe('editing');
  });

  it('ignores edits while saving', () => {
    const saving = roomFormReducer(initialRoomFormState({ name: 'Sala 3', age: '' }), { type: ROOM_FORM_ACTIONS.SAVE_STARTED });
    const state = roomFormReducer(saving, { type: ROOM_FORM_ACTIONS.FIELD_CHANGED, field: 'name', value: 'Sala 9' });

    expect(state.values.name).toBe('Sala 3');
  });
});
