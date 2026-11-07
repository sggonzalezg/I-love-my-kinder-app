import type { OutingAnswer, OutingDecision } from '@/lib/outing';

export type AnswerIntent = 'authorize' | 'decline' | 'withdraw';
export type SaveFailureReason = 'offline' | 'error';

export interface PermissionState {
  confirm: { childId: string; intent: AnswerIntent } | null;
  savingChildId: string | null;
  failure: { childId: string; reason: SaveFailureReason } | null;
  savedAnswers: OutingAnswer[];
  toastVisible: boolean;
  signedChildId: string | null;
}

export const INITIAL_PERMISSION_STATE: PermissionState = {
  confirm: null,
  savingChildId: null,
  failure: null,
  savedAnswers: [],
  toastVisible: false,
  signedChildId: null,
};

export const PERMISSION_ACTIONS = {
  CONFIRM_OPENED: 'confirmOpened',
  CONFIRM_CLOSED: 'confirmClosed',
  SAVE_STARTED: 'saveStarted',
  SAVE_SUCCEEDED: 'saveSucceeded',
  SAVE_FAILED: 'saveFailed',
  TOAST_HIDDEN: 'toastHidden',
} as const;

export type PermissionAction =
  | { type: typeof PERMISSION_ACTIONS.CONFIRM_OPENED; childId: string; intent: AnswerIntent }
  | { type: typeof PERMISSION_ACTIONS.CONFIRM_CLOSED }
  | { type: typeof PERMISSION_ACTIONS.SAVE_STARTED; childId: string }
  | { type: typeof PERMISSION_ACTIONS.SAVE_SUCCEEDED; answer: OutingAnswer }
  | { type: typeof PERMISSION_ACTIONS.SAVE_FAILED; childId: string; reason: SaveFailureReason }
  | { type: typeof PERMISSION_ACTIONS.TOAST_HIDDEN };

const DECISIONS: Record<AnswerIntent, Exclude<OutingDecision, 'pending'>> = {
  authorize: 'authorized',
  decline: 'declined',
  withdraw: 'withdrawn',
};

export function decisionOf(intent: AnswerIntent): Exclude<OutingDecision, 'pending'> {
  return DECISIONS[intent];
}

export function outingPermissionReducer(state: PermissionState, action: PermissionAction): PermissionState {
  switch (action.type) {
    case PERMISSION_ACTIONS.CONFIRM_OPENED:
      return { ...state, confirm: { childId: action.childId, intent: action.intent } };
    case PERMISSION_ACTIONS.CONFIRM_CLOSED:
      return { ...state, confirm: null };
    case PERMISSION_ACTIONS.SAVE_STARTED:
      return { ...state, confirm: null, savingChildId: action.childId, failure: null };
    case PERMISSION_ACTIONS.SAVE_SUCCEEDED: {
      const signed = action.answer.decision === 'authorized';
      return {
        ...state,
        savingChildId: null,
        savedAnswers: [...state.savedAnswers, action.answer],
        toastVisible: signed,
        signedChildId: signed ? action.answer.child_id : null,
      };
    }
    case PERMISSION_ACTIONS.SAVE_FAILED:
      return { ...state, savingChildId: null, failure: { childId: action.childId, reason: action.reason } };
    case PERMISSION_ACTIONS.TOAST_HIDDEN:
      return { ...state, toastVisible: false };
  }
}
