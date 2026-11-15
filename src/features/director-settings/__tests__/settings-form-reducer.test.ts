import { SETTINGS_FORM_ACTIONS, initialSettingsFormState, settingsFormReducer } from '../settings-form-reducer';

const SAVED = {
  details: { address: 'Av. Rivera 3456', contactPhone: '094 555 010', urgentPhone: '094 555 010' },
  shifts: [
    { name: 'morning' as const, startTime: '08:00', endTime: '12:30' },
    { name: 'afternoon' as const, startTime: null, endTime: null },
  ],
};

describe('settingsFormReducer', () => {
  it('starts on the stored settings with no sheet open', () => {
    const state = initialSettingsFormState(SAVED);

    expect([state.edited, state.timeSheet, state.status]).toEqual([SAVED, null, 'editing']);
  });

  it('changes one field and keeps the others', () => {
    const state = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.FIELD_CHANGED,
      field: 'address',
      value: 'Av. Italia 10',
    });

    expect(state.edited.details).toEqual({ ...SAVED.details, address: 'Av. Italia 10' });
  });

  it('opens the time sheet on the shift time', () => {
    const state = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'morning',
      edge: 'endTime',
    });

    expect(state.timeSheet).toEqual({ shiftName: 'morning', edge: 'endTime', draftTime: '12:30' });
  });

  it('opens the time sheet on a default time when the shift has none', () => {
    const state = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'afternoon',
      edge: 'startTime',
    });

    expect(state.timeSheet?.draftTime).toBe('13:00');
  });

  it('moves the draft time without touching the shift', () => {
    const opened = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'morning',
      edge: 'startTime',
    });
    const state = settingsFormReducer(opened, { type: SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED, time: '08:30' });

    expect([state.timeSheet?.draftTime, state.edited.shifts[0].startTime]).toEqual(['08:30', '08:00']);
  });

  it('writes the draft time into the shift on confirm and closes the sheet', () => {
    const opened = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'morning',
      edge: 'startTime',
    });
    const drafted = settingsFormReducer(opened, { type: SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED, time: '08:30' });
    const state = settingsFormReducer(drafted, { type: SETTINGS_FORM_ACTIONS.TIME_SHEET_CONFIRMED });

    expect([state.edited.shifts[0].startTime, state.timeSheet]).toEqual(['08:30', null]);
  });

  it('drops the draft when the sheet is cancelled', () => {
    const opened = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'morning',
      edge: 'startTime',
    });
    const drafted = settingsFormReducer(opened, { type: SETTINGS_FORM_ACTIONS.DRAFT_TIME_CHANGED, time: '09:00' });
    const state = settingsFormReducer(drafted, { type: SETTINGS_FORM_ACTIONS.TIME_SHEET_CLOSED });

    expect([state.edited.shifts[0].startTime, state.timeSheet]).toEqual(['08:00', null]);
  });

  it('marks saving', () => {
    const state = settingsFormReducer(initialSettingsFormState(SAVED), { type: SETTINGS_FORM_ACTIONS.SAVE_STARTED });

    expect(state.status).toBe('saving');
  });

  it('keeps the values after a failed save', () => {
    const edited = settingsFormReducer(initialSettingsFormState(SAVED), {
      type: SETTINGS_FORM_ACTIONS.FIELD_CHANGED,
      field: 'address',
      value: 'Av. Italia 10',
    });
    const saving = settingsFormReducer(edited, { type: SETTINGS_FORM_ACTIONS.SAVE_STARTED });
    const failed = settingsFormReducer(saving, { type: SETTINGS_FORM_ACTIONS.SAVE_FAILED });

    expect([failed.status, failed.edited.details.address]).toEqual(['failed', 'Av. Italia 10']);
  });

  it('clears the failure once a field changes', () => {
    const failed = settingsFormReducer(initialSettingsFormState(SAVED), { type: SETTINGS_FORM_ACTIONS.SAVE_FAILED });
    const state = settingsFormReducer(failed, { type: SETTINGS_FORM_ACTIONS.FIELD_CHANGED, field: 'address', value: 'Av. Italia 10' });

    expect(state.status).toBe('editing');
  });

  it('ignores edits and time sheets while saving', () => {
    const saving = settingsFormReducer(initialSettingsFormState(SAVED), { type: SETTINGS_FORM_ACTIONS.SAVE_STARTED });
    const edited = settingsFormReducer(saving, { type: SETTINGS_FORM_ACTIONS.FIELD_CHANGED, field: 'address', value: 'Otra' });
    const opened = settingsFormReducer(edited, {
      type: SETTINGS_FORM_ACTIONS.TIME_SHEET_OPENED,
      shiftName: 'morning',
      edge: 'startTime',
    });

    expect([opened.edited.details.address, opened.timeSheet]).toEqual(['Av. Rivera 3456', null]);
  });
});
