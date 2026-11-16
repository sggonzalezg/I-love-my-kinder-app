import { isNetworkFailure } from '@/lib/network';

export const EMAIL_CODE_LENGTH = 6;
export const EMAIL_CODE_LIFETIME_MS = 10 * 60 * 1000;
export const EMAIL_CODE_RESEND_SECONDS = 60;

export const EMAIL_PROBLEMS = {
  EMPTY: 'empty',
  MALFORMED: 'malformed',
  MISSING_END: 'missingEnd',
} as const;

export type EmailProblem = (typeof EMAIL_PROBLEMS)[keyof typeof EMAIL_PROBLEMS];

export const SIGN_IN_FAILURES = {
  NOT_ENABLED: 'notEnabled',
  RATE_LIMITED: 'rateLimited',
  WRONG_CODE: 'wrongCode',
  EXPIRED: 'expired',
  NETWORK: 'network',
  OTHER: 'other',
} as const;

export type SignInFailure = (typeof SIGN_IN_FAILURES)[keyof typeof SIGN_IN_FAILURES];

export interface AuthFailure {
  name?: string;
  status?: number;
  code?: string;
  message?: string;
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+$/;
const DOMAIN_WITH_END = /\.[^.\s@]{2,}$/;
const NOT_ENABLED_MESSAGE = 'account_not_enabled';
const TOO_MANY_REQUESTS_STATUS = 429;
const RATE_LIMIT_CODES = ['over_email_send_rate_limit', 'over_request_rate_limit'];
const RETRYABLE_FETCH_ERROR = 'AuthRetryableFetchError';
const REFUSED_CODE_STATUS = 403;
const REFUSED_CODE_CODES = ['otp_expired', 'invalid_credentials'];

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function emailProblem(raw: string): EmailProblem | null {
  const email = normalizeEmail(raw);
  if (!email) return EMAIL_PROBLEMS.EMPTY;
  if (!EMAIL_SHAPE.test(email)) return EMAIL_PROBLEMS.MALFORMED;
  return DOMAIN_WITH_END.test(email.split('@')[1]) ? null : EMAIL_PROBLEMS.MISSING_END;
}

function isRateLimited(failure: AuthFailure): boolean {
  return failure.status === TOO_MANY_REQUESTS_STATUS || RATE_LIMIT_CODES.includes(failure.code ?? '');
}

function isNoConnection(failure: AuthFailure): boolean {
  return failure.name === RETRYABLE_FETCH_ERROR || isNetworkFailure(failure);
}

/** The before-user-created hook refuses an email the nursery did not register, so no code is mailed. */
export function sendCodeFailure(failure: AuthFailure): SignInFailure {
  if (failure.message?.includes(NOT_ENABLED_MESSAGE)) return SIGN_IN_FAILURES.NOT_ENABLED;
  if (isRateLimited(failure)) return SIGN_IN_FAILURES.RATE_LIMITED;
  if (isNoConnection(failure)) return SIGN_IN_FAILURES.NETWORK;
  return SIGN_IN_FAILURES.OTHER;
}

/** Supabase answers `otp_expired` for a wrong code and an expired one alike, so the send time tells them apart. */
export function verifyCodeFailure(failure: AuthFailure, sentAt: number, now: number): SignInFailure {
  if (isRateLimited(failure)) return SIGN_IN_FAILURES.RATE_LIMITED;
  if (isNoConnection(failure)) return SIGN_IN_FAILURES.NETWORK;
  const isRefusedCode = failure.status === REFUSED_CODE_STATUS || REFUSED_CODE_CODES.includes(failure.code ?? '');
  if (!isRefusedCode) return SIGN_IN_FAILURES.OTHER;
  return now - sentAt >= EMAIL_CODE_LIFETIME_MS ? SIGN_IN_FAILURES.EXPIRED : SIGN_IN_FAILURES.WRONG_CODE;
}
