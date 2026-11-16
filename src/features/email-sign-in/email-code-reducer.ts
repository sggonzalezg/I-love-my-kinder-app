import { EMAIL_CODE_LENGTH, EMAIL_CODE_RESEND_SECONDS, SIGN_IN_FAILURES, type SignInFailure } from '@/lib/email-sign-in';

export const CODE_STATUSES = {
  FILLING: 'filling',
  VERIFYING: 'verifying',
  CORRECT: 'correct',
  WRONG: 'wrong',
  EXPIRED: 'expired',
  WAITING: 'waiting',
} as const;

export type CodeStatus = (typeof CODE_STATUSES)[keyof typeof CODE_STATUSES];

export interface EmailCodeState {
  code: string;
  /** The refused code stays in the red boxes until the person types again. */
  rejectedCode: string;
  status: CodeStatus;
  sentAt: number;
  resendSeconds: number;
  resending: boolean;
  failure: SignInFailure | null;
}

export const EMAIL_CODE_ACTIONS = {
  CODE_CHANGED: 'codeChanged',
  VERIFIED: 'verified',
  VERIFY_FAILED: 'verifyFailed',
  RESEND_STARTED: 'resendStarted',
  CODE_SENT: 'codeSent',
  RESEND_FAILED: 'resendFailed',
  TICKED: 'ticked',
} as const;

export type EmailCodeAction =
  | { type: typeof EMAIL_CODE_ACTIONS.CODE_CHANGED; code: string }
  | { type: typeof EMAIL_CODE_ACTIONS.VERIFIED }
  | { type: typeof EMAIL_CODE_ACTIONS.VERIFY_FAILED; failure: SignInFailure }
  | { type: typeof EMAIL_CODE_ACTIONS.RESEND_STARTED }
  | { type: typeof EMAIL_CODE_ACTIONS.CODE_SENT; sentAt: number }
  | { type: typeof EMAIL_CODE_ACTIONS.RESEND_FAILED; failure: SignInFailure }
  | { type: typeof EMAIL_CODE_ACTIONS.TICKED };

export function initialEmailCodeState(sentAt: number, isWaiting: boolean): EmailCodeState {
  return {
    code: '',
    rejectedCode: '',
    status: isWaiting ? CODE_STATUSES.WAITING : CODE_STATUSES.FILLING,
    sentAt,
    resendSeconds: isWaiting ? 0 : EMAIL_CODE_RESEND_SECONDS,
    resending: false,
    failure: null,
  };
}

const NON_DIGITS = /\D/g;
const EDITABLE_STATUSES: CodeStatus[] = [CODE_STATUSES.FILLING, CODE_STATUSES.WRONG];

function statusAfterFailure(failure: SignInFailure): CodeStatus {
  if (failure === SIGN_IN_FAILURES.WRONG_CODE) return CODE_STATUSES.WRONG;
  if (failure === SIGN_IN_FAILURES.EXPIRED) return CODE_STATUSES.EXPIRED;
  if (failure === SIGN_IN_FAILURES.RATE_LIMITED) return CODE_STATUSES.WAITING;
  return CODE_STATUSES.FILLING;
}

export function emailCodeReducer(state: EmailCodeState, action: EmailCodeAction): EmailCodeState {
  switch (action.type) {
    case EMAIL_CODE_ACTIONS.CODE_CHANGED: {
      if (!EDITABLE_STATUSES.includes(state.status)) return state;
      const code = action.code.replace(NON_DIGITS, '').slice(0, EMAIL_CODE_LENGTH);
      if (!code) return { ...state, code };
      const status = code.length === EMAIL_CODE_LENGTH ? CODE_STATUSES.VERIFYING : CODE_STATUSES.FILLING;
      return { ...state, code, rejectedCode: '', status, failure: null };
    }
    case EMAIL_CODE_ACTIONS.VERIFIED:
      return { ...state, status: CODE_STATUSES.CORRECT };
    case EMAIL_CODE_ACTIONS.VERIFY_FAILED: {
      const status = statusAfterFailure(action.failure);
      const keepsDigits = status === CODE_STATUSES.WRONG || status === CODE_STATUSES.EXPIRED;
      const keepsFailure = status === CODE_STATUSES.FILLING;
      return { ...state, status, code: '', rejectedCode: keepsDigits ? state.code : '', failure: keepsFailure ? action.failure : null };
    }
    case EMAIL_CODE_ACTIONS.RESEND_STARTED:
      if (state.resending || state.resendSeconds > 0) return state;
      return { ...state, resending: true, failure: null };
    case EMAIL_CODE_ACTIONS.CODE_SENT:
      return initialEmailCodeState(action.sentAt, false);
    case EMAIL_CODE_ACTIONS.RESEND_FAILED: {
      const isLimited = action.failure === SIGN_IN_FAILURES.RATE_LIMITED;
      return { ...state, resending: false, status: isLimited ? CODE_STATUSES.WAITING : state.status, failure: isLimited ? null : action.failure };
    }
    case EMAIL_CODE_ACTIONS.TICKED:
      return { ...state, resendSeconds: Math.max(0, state.resendSeconds - 1) };
    default:
      return state;
  }
}
