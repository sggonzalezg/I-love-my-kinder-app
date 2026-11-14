export interface DeleteAccountStartState {
  open: boolean;
  checking: boolean;
  onlyDirector: boolean;
  soleTeacherGroup: string | null;
  error: string | null;
}

export const DELETE_ACCOUNT_START_ACTIONS = {
  OPENED: 'opened',
  CHECK_SUCCEEDED: 'checkSucceeded',
  CHECK_FAILED: 'checkFailed',
  CHECK_RETRIED: 'checkRetried',
  CLOSED: 'closed',
} as const;

export type DeleteAccountStartAction =
  | { type: typeof DELETE_ACCOUNT_START_ACTIONS.OPENED; needsCheck: boolean }
  | { type: typeof DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED; onlyDirector: boolean; soleTeacherGroup: string | null }
  | { type: typeof DELETE_ACCOUNT_START_ACTIONS.CHECK_FAILED; message: string }
  | { type: typeof DELETE_ACCOUNT_START_ACTIONS.CHECK_RETRIED }
  | { type: typeof DELETE_ACCOUNT_START_ACTIONS.CLOSED };

export const initialDeleteAccountStartState: DeleteAccountStartState = {
  open: false,
  checking: false,
  onlyDirector: false,
  soleTeacherGroup: null,
  error: null,
};

export function deleteAccountStartReducer(state: DeleteAccountStartState, action: DeleteAccountStartAction): DeleteAccountStartState {
  switch (action.type) {
    case DELETE_ACCOUNT_START_ACTIONS.OPENED:
      return { ...initialDeleteAccountStartState, open: true, checking: action.needsCheck };
    case DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED:
      return { ...state, checking: false, onlyDirector: action.onlyDirector, soleTeacherGroup: action.soleTeacherGroup };
    case DELETE_ACCOUNT_START_ACTIONS.CHECK_FAILED:
      return { ...state, checking: false, error: action.message };
    case DELETE_ACCOUNT_START_ACTIONS.CHECK_RETRIED:
      return { ...state, checking: true, error: null };
    case DELETE_ACCOUNT_START_ACTIONS.CLOSED:
      return initialDeleteAccountStartState;
  }
}
