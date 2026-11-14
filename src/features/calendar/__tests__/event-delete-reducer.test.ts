import { EVENT_DELETE_ACTIONS, INITIAL_EVENT_DELETE_STATE, eventDeleteReducer, type EventDeleteState } from '../event-delete-reducer';

const OPEN: EventDeleteState = { sheetOpen: true, reason: '', deleting: false, failed: false };

describe('eventDeleteReducer', () => {
  it('opens the sheet clean', () => {
    const state = eventDeleteReducer({ ...INITIAL_EVENT_DELETE_STATE, reason: 'viejo', failed: true }, { type: EVENT_DELETE_ACTIONS.SHEET_OPENED });
    expect(state).toEqual(OPEN);
  });

  it('keeps the typed reason', () => {
    expect(eventDeleteReducer(OPEN, { type: EVENT_DELETE_ACTIONS.REASON_CHANGED, reason: 'Lluvia' }).reason).toBe('Lluvia');
  });

  it('marks the delete as running and clears a past failure', () => {
    const state = eventDeleteReducer({ ...OPEN, failed: true }, { type: EVENT_DELETE_ACTIONS.DELETE_STARTED });
    expect([state.deleting, state.failed]).toEqual([true, false]);
  });

  it('shows the failure and lets the user try again', () => {
    const state = eventDeleteReducer({ ...OPEN, deleting: true }, { type: EVENT_DELETE_ACTIONS.DELETE_FAILED });
    expect([state.deleting, state.failed, state.sheetOpen]).toEqual([false, true, true]);
  });

  it('closes the sheet', () => {
    expect(eventDeleteReducer(OPEN, { type: EVENT_DELETE_ACTIONS.SHEET_CLOSED }).sheetOpen).toBe(false);
  });

  it('does not close the sheet while deleting', () => {
    expect(eventDeleteReducer({ ...OPEN, deleting: true }, { type: EVENT_DELETE_ACTIONS.SHEET_CLOSED }).sheetOpen).toBe(true);
  });
});
