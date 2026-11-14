export const EVENT_DELETE_ACTIONS = {
  SHEET_OPENED: 'sheetOpened',
  SHEET_CLOSED: 'sheetClosed',
  REASON_CHANGED: 'reasonChanged',
  DELETE_STARTED: 'deleteStarted',
  DELETE_FAILED: 'deleteFailed',
} as const;

export interface EventDeleteState {
  sheetOpen: boolean;
  reason: string;
  deleting: boolean;
  failed: boolean;
}

export type EventDeleteAction =
  | { type: typeof EVENT_DELETE_ACTIONS.SHEET_OPENED }
  | { type: typeof EVENT_DELETE_ACTIONS.SHEET_CLOSED }
  | { type: typeof EVENT_DELETE_ACTIONS.REASON_CHANGED; reason: string }
  | { type: typeof EVENT_DELETE_ACTIONS.DELETE_STARTED }
  | { type: typeof EVENT_DELETE_ACTIONS.DELETE_FAILED };

export const INITIAL_EVENT_DELETE_STATE: EventDeleteState = { sheetOpen: false, reason: '', deleting: false, failed: false };

export function eventDeleteReducer(state: EventDeleteState, action: EventDeleteAction): EventDeleteState {
  switch (action.type) {
    case EVENT_DELETE_ACTIONS.SHEET_OPENED:
      return { ...INITIAL_EVENT_DELETE_STATE, sheetOpen: true };
    case EVENT_DELETE_ACTIONS.SHEET_CLOSED:
      return state.deleting ? state : { ...state, sheetOpen: false };
    case EVENT_DELETE_ACTIONS.REASON_CHANGED:
      return { ...state, reason: action.reason };
    case EVENT_DELETE_ACTIONS.DELETE_STARTED:
      return { ...state, deleting: true, failed: false };
    case EVENT_DELETE_ACTIONS.DELETE_FAILED:
      return { ...state, deleting: false, failed: true };
  }
}
