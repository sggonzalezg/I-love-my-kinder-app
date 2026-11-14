import { EVENT_FORM_ACTIONS, eventFormReducer, initialEventFormState, type EventFormState } from '@/features/calendar/event-form-reducer';
import { emptyEventForm } from '@/lib/event-form';

const TODAY = new Date(2026, 9, 24);

function loadedState(overrides: Partial<ReturnType<typeof emptyEventForm>> = {}): EventFormState {
  return eventFormReducer(initialEventFormState(emptyEventForm(null)), {
    type: EVENT_FORM_ACTIONS.FORM_LOADED,
    values: { ...emptyEventForm('room-2:shift-am'), ...overrides },
  });
}

describe('eventFormReducer', () => {
  it('keeps the loaded values as the clean starting point', () => {
    const state = loadedState({ title: 'Taller' });

    expect(state.loaded).toBe(true);
    expect(state.initial).toEqual(state.values);
  });

  it('changes a field and clears a save error', () => {
    const failed = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.SAVE_FAILED, offline: true });

    const state = eventFormReducer(failed, { type: EVENT_FORM_ACTIONS.FIELD_CHANGED, values: { title: 'Taller' } });

    expect(state.values.title).toBe('Taller');
    expect(state.saveError).toBeNull();
  });

  it('opens the day sheet on the current month when no day is set', () => {
    const state = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet: 'date', today: TODAY });

    expect(state.sheet).toBe('date');
    expect(state.sheetMonth).toEqual({ year: 2026, month: 9 });
  });

  it('opens the Hasta sheet on the month of Desde', () => {
    const state = eventFormReducer(loadedState({ date: '2026-12-21' }), { type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet: 'until', today: TODAY });

    expect(state.sheetMonth).toEqual({ year: 2026, month: 11 });
  });

  it('moves the sheet month across the year', () => {
    const opened = eventFormReducer(loadedState({ date: '2026-12-21' }), { type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet: 'date', today: TODAY });

    const state = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.SHEET_MONTH_SHIFTED, step: 1 });

    expect(state.sheetMonth).toEqual({ year: 2027, month: 0 });
  });

  it('sets the chosen day only on confirm', () => {
    const opened = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet: 'date', today: TODAY });
    const chosen = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN, date: '2026-10-28' });

    expect(chosen.values.date).toBeNull();
    const state = eventFormReducer(chosen, { type: EVENT_FORM_ACTIONS.SHEET_CONFIRMED });

    expect(state.values.date).toBe('2026-10-28');
    expect(state.sheet).toBeNull();
  });

  it('drops Hasta when the new first day is not before it', () => {
    const opened = eventFormReducer(loadedState({ date: '2026-10-20', untilDate: '2026-10-25' }), {
      type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED,
      sheet: 'date',
      today: TODAY,
    });
    const chosen = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN, date: '2026-10-25' });

    expect(eventFormReducer(chosen, { type: EVENT_FORM_ACTIONS.SHEET_CONFIRMED }).values.untilDate).toBeNull();
  });

  it('sets Hasta from its sheet', () => {
    const opened = eventFormReducer(loadedState({ date: '2026-10-20' }), { type: EVENT_FORM_ACTIONS.DATE_SHEET_OPENED, sheet: 'until', today: TODAY });
    const chosen = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.DRAFT_DATE_CHOSEN, date: '2026-10-25' });

    expect(eventFormReducer(chosen, { type: EVENT_FORM_ACTIONS.SHEET_CONFIRMED }).values.untilDate).toBe('2026-10-25');
  });

  it('goes back to one day with "Un solo día"', () => {
    const state = eventFormReducer(loadedState({ date: '2026-10-20', untilDate: '2026-10-25' }), { type: EVENT_FORM_ACTIONS.UNTIL_CLEARED });

    expect(state.values.untilDate).toBeNull();
  });

  it('edits the end time through its sheet', () => {
    const opened = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.TIME_SHEET_OPENED, sheet: 'end' });
    const changed = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.DRAFT_TIME_CHANGED, time: '11:00' });

    expect(opened.draftTime).toBe('10:00');
    expect(eventFormReducer(changed, { type: EVENT_FORM_ACTIONS.SHEET_CONFIRMED }).values.endTime).toBe('11:00');
  });

  it('leaves the value as it was when the sheet closes without confirming', () => {
    const opened = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.TIME_SHEET_OPENED, sheet: 'start' });
    const changed = eventFormReducer(opened, { type: EVENT_FORM_ACTIONS.DRAFT_TIME_CHANGED, time: '07:00' });

    const state = eventFormReducer(changed, { type: EVENT_FORM_ACTIONS.SHEET_CLOSED });

    expect(state.values.startTime).toBe('09:00');
    expect(state.sheet).toBeNull();
  });

  it('asks before discarding and can go back to editing', () => {
    const asked = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.DISCARD_ASKED });

    expect(asked.discardOpen).toBe(true);
    expect(eventFormReducer(asked, { type: EVENT_FORM_ACTIONS.DISCARD_CANCELLED }).discardOpen).toBe(false);
  });

  it('opens the re-sign sheet and goes back to editing', () => {
    const asked = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.RESIGN_ASKED });

    expect(asked.resignOpen).toBe(true);
    expect(eventFormReducer(asked, { type: EVENT_FORM_ACTIONS.RESIGN_CANCELLED }).resignOpen).toBe(false);
  });

  it('closes the re-sign sheet once saving starts', () => {
    const asked = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.RESIGN_ASKED });

    const saving = eventFormReducer(asked, { type: EVENT_FORM_ACTIONS.SAVE_STARTED });

    expect(saving.resignOpen).toBe(false);
    expect(saving.saving).toBe(true);
  });

  it('keeps the data when saving fails', () => {
    const saving = eventFormReducer(loadedState({ title: 'Taller' }), { type: EVENT_FORM_ACTIONS.SAVE_STARTED });

    const state = eventFormReducer(saving, { type: EVENT_FORM_ACTIONS.SAVE_FAILED, offline: false });

    expect(saving.saving).toBe(true);
    expect(state.saving).toBe(false);
    expect(state.saveError).toBe('failed');
    expect(state.values.title).toBe('Taller');
  });

  it('tells a network failure apart', () => {
    const state = eventFormReducer(loadedState(), { type: EVENT_FORM_ACTIONS.SAVE_FAILED, offline: true });

    expect(state.saveError).toBe('offline');
  });
});
