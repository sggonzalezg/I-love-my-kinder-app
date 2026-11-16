import {
  EMAIL_CODE_LIFETIME_MS,
  EMAIL_PROBLEMS,
  SIGN_IN_FAILURES,
  emailProblem,
  normalizeEmail,
  sendCodeFailure,
  verifyCodeFailure,
} from '../email-sign-in';

const SENT_AT = Date.parse('2026-11-16T10:00:00Z');

describe('normalizeEmail', () => {
  it('trims and lower-cases the email', () => {
    expect(normalizeEmail('  Ana.Rodriguez@Gmail.COM ')).toBe('ana.rodriguez@gmail.com');
  });
});

describe('emailProblem', () => {
  it('accepts a full email', () => {
    expect(emailProblem('ana.rodriguez@gmail.com')).toBeNull();
  });

  it('accepts an email with spaces around it', () => {
    expect(emailProblem(' ana@correo.com.uy ')).toBeNull();
  });

  it('asks for the email when the field is empty', () => {
    expect(emailProblem('   ')).toBe(EMAIL_PROBLEMS.EMPTY);
  });

  it('says the end is missing when the domain has no dot', () => {
    expect(emailProblem('ana.rodriguez@gmail')).toBe(EMAIL_PROBLEMS.MISSING_END);
  });

  it('says the end is missing when the domain ends in a dot', () => {
    expect(emailProblem('ana@gmail.')).toBe(EMAIL_PROBLEMS.MISSING_END);
  });

  it('flags an email without @ as malformed', () => {
    expect(emailProblem('ana.rodriguez.gmail.com')).toBe(EMAIL_PROBLEMS.MALFORMED);
  });

  it('flags an email with spaces inside as malformed', () => {
    expect(emailProblem('ana rodriguez@gmail.com')).toBe(EMAIL_PROBLEMS.MALFORMED);
  });
});

describe('sendCodeFailure', () => {
  it('reads the hook refusal as an account not enabled', () => {
    expect(sendCodeFailure({ status: 403, message: 'account_not_enabled' })).toBe(SIGN_IN_FAILURES.NOT_ENABLED);
  });

  it('reads a 429 as a rate limit', () => {
    expect(sendCodeFailure({ status: 429, message: 'For security purposes, you can only request this after 60 seconds.' })).toBe(
      SIGN_IN_FAILURES.RATE_LIMITED,
    );
  });

  it('reads the email send limit code as a rate limit', () => {
    expect(sendCodeFailure({ status: 400, code: 'over_email_send_rate_limit', message: 'Email rate limit exceeded' })).toBe(
      SIGN_IN_FAILURES.RATE_LIMITED,
    );
  });

  it('reads a failed fetch as no connection', () => {
    expect(sendCodeFailure({ name: 'AuthRetryableFetchError', status: 0, message: 'Failed to fetch' })).toBe(SIGN_IN_FAILURES.NETWORK);
  });

  it('reads anything else as another failure', () => {
    expect(sendCodeFailure({ status: 500, message: 'Error sending magic link email' })).toBe(SIGN_IN_FAILURES.OTHER);
  });
});

describe('verifyCodeFailure', () => {
  const otpExpired = { status: 403, code: 'otp_expired', message: 'Token has expired or is invalid' };

  it('calls a refused code wrong while the code is still alive', () => {
    expect(verifyCodeFailure(otpExpired, SENT_AT, SENT_AT + 60_000)).toBe(SIGN_IN_FAILURES.WRONG_CODE);
  });

  it('calls a refused code expired once its 10 minutes passed', () => {
    expect(verifyCodeFailure(otpExpired, SENT_AT, SENT_AT + EMAIL_CODE_LIFETIME_MS)).toBe(SIGN_IN_FAILURES.EXPIRED);
  });

  it('reads a 429 as a rate limit', () => {
    expect(verifyCodeFailure({ status: 429, code: 'over_request_rate_limit', message: 'Request rate limit reached' }, SENT_AT, SENT_AT)).toBe(
      SIGN_IN_FAILURES.RATE_LIMITED,
    );
  });

  it('reads a failed fetch as no connection', () => {
    expect(verifyCodeFailure({ name: 'AuthRetryableFetchError', status: 0, message: 'Failed to fetch' }, SENT_AT, SENT_AT)).toBe(
      SIGN_IN_FAILURES.NETWORK,
    );
  });

  it('reads a server error as another failure', () => {
    expect(verifyCodeFailure({ status: 500, message: 'Database error' }, SENT_AT, SENT_AT)).toBe(SIGN_IN_FAILURES.OTHER);
  });
});
