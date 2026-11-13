import { DELETION_CODE_LENGTH, RESEND_WAIT_SECONDS, isCompleteDeletionCode } from '@/lib/account-deletion';

export const DELETION_PHASES = {
  SENDING: 'sending',
  READY: 'ready',
  DELETING: 'deleting',
  DELETED: 'deleted',
} as const;

export type DeletionPhase = (typeof DELETION_PHASES)[keyof typeof DELETION_PHASES];

export interface DeleteAccountState {
  phase: DeletionPhase;
  code: string;
  error: string | null;
  resendSeconds: number;
  deletedAt: string | null;
}

export const DELETE_ACCOUNT_ACTIONS = {
  CODE_REQUESTED: 'codeRequested',
  CODE_SENT: 'codeSent',
  SEND_FAILED: 'sendFailed',
  CODE_CHANGED: 'codeChanged',
  TICKED: 'ticked',
  DELETE_STARTED: 'deleteStarted',
  DELETE_FAILED: 'deleteFailed',
  DELETED: 'deleted',
} as const;

export type DeleteAccountAction =
  | { type: typeof DELETE_ACCOUNT_ACTIONS.CODE_REQUESTED }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.CODE_SENT }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.SEND_FAILED; message: string }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.CODE_CHANGED; code: string }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.TICKED }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.DELETE_STARTED }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.DELETE_FAILED; message: string }
  | { type: typeof DELETE_ACCOUNT_ACTIONS.DELETED; deletedAt: string };

export const initialDeleteAccountState: DeleteAccountState = {
  phase: DELETION_PHASES.SENDING,
  code: '',
  error: null,
  resendSeconds: 0,
  deletedAt: null,
};

const NON_DIGITS = /\D/g;

export function deleteAccountReducer(state: DeleteAccountState, action: DeleteAccountAction): DeleteAccountState {
  switch (action.type) {
    case DELETE_ACCOUNT_ACTIONS.CODE_REQUESTED:
      return { ...state, phase: DELETION_PHASES.SENDING, error: null };
    case DELETE_ACCOUNT_ACTIONS.CODE_SENT:
      return { ...state, phase: DELETION_PHASES.READY, resendSeconds: RESEND_WAIT_SECONDS };
    case DELETE_ACCOUNT_ACTIONS.SEND_FAILED:
      return { ...state, phase: DELETION_PHASES.READY, error: action.message, resendSeconds: 0 };
    case DELETE_ACCOUNT_ACTIONS.CODE_CHANGED:
      return { ...state, code: action.code.replace(NON_DIGITS, '').slice(0, DELETION_CODE_LENGTH), error: null };
    case DELETE_ACCOUNT_ACTIONS.TICKED:
      return { ...state, resendSeconds: Math.max(0, state.resendSeconds - 1) };
    case DELETE_ACCOUNT_ACTIONS.DELETE_STARTED:
      if (state.phase !== DELETION_PHASES.READY || !isCompleteDeletionCode(state.code)) return state;
      return { ...state, phase: DELETION_PHASES.DELETING, error: null };
    case DELETE_ACCOUNT_ACTIONS.DELETE_FAILED:
      return { ...state, phase: DELETION_PHASES.READY, code: '', error: action.message };
    case DELETE_ACCOUNT_ACTIONS.DELETED:
      return { ...state, phase: DELETION_PHASES.DELETED, deletedAt: action.deletedAt };
  }
}
