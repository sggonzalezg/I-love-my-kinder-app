import type { EmailProblem, SignInFailure } from '@/lib/email-sign-in';

export interface EmailEntryState {
  email: string;
  problem: EmailProblem | null;
  sending: boolean;
  failure: SignInFailure | null;
}

export const EMAIL_ENTRY_ACTIONS = {
  EMAIL_CHANGED: 'emailChanged',
  SEND_REFUSED: 'sendRefused',
  SEND_STARTED: 'sendStarted',
  SEND_FAILED: 'sendFailed',
  SEND_FINISHED: 'sendFinished',
} as const;

export type EmailEntryAction =
  | { type: typeof EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED; email: string }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_REFUSED; problem: EmailProblem }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_STARTED }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_FAILED; failure: SignInFailure }
  | { type: typeof EMAIL_ENTRY_ACTIONS.SEND_FINISHED };

export const initialEmailEntryState: EmailEntryState = { email: '', problem: null, sending: false, failure: null };

export function emailEntryReducer(state: EmailEntryState, action: EmailEntryAction): EmailEntryState {
  switch (action.type) {
    case EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED:
      if (state.sending) return state;
      return { ...state, email: action.email, problem: null };
    case EMAIL_ENTRY_ACTIONS.SEND_REFUSED:
      return { ...state, problem: action.problem };
    case EMAIL_ENTRY_ACTIONS.SEND_STARTED:
      return { ...state, sending: true, problem: null, failure: null };
    case EMAIL_ENTRY_ACTIONS.SEND_FAILED:
      return { ...state, sending: false, failure: action.failure };
    case EMAIL_ENTRY_ACTIONS.SEND_FINISHED:
      return { ...state, sending: false };
    default:
      return state;
  }
}
