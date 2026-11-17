import { SIGN_IN_FAILURES } from '@/lib/email-sign-in';
import { SOCIAL_PROVIDERS, availableProviders, idTokenEmail, providerSignInFailure } from '@/lib/social-sign-in';

function idTokenWithPayload(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${encoded}.signature`;
}

describe('availableProviders', () => {
  it('puts Apple first on an iPhone that supports it', () => {
    expect(availableProviders({ appleAvailable: true, googleAvailable: true })).toEqual([SOCIAL_PROVIDERS.APPLE, SOCIAL_PROVIDERS.GOOGLE]);
  });

  it('offers only Google where Apple is not available', () => {
    expect(availableProviders({ appleAvailable: false, googleAvailable: true })).toEqual([SOCIAL_PROVIDERS.GOOGLE]);
  });

  it('offers only Apple when the Google sign-in is not set up', () => {
    expect(availableProviders({ appleAvailable: true, googleAvailable: false })).toEqual([SOCIAL_PROVIDERS.APPLE]);
  });

  it('offers no provider when neither is available', () => {
    expect(availableProviders({ appleAvailable: false, googleAvailable: false })).toEqual([]);
  });
});

describe('idTokenEmail', () => {
  it('reads the email claim of the ID token', () => {
    expect(idTokenEmail(idTokenWithPayload({ sub: 'apple-1', email: 'Ana@Gmail.com' }))).toBe('ana@gmail.com');
  });

  it('reads an Apple relay email', () => {
    expect(idTokenEmail(idTokenWithPayload({ email: 'x7k2p9@privaterelay.appleid.com' }))).toBe('x7k2p9@privaterelay.appleid.com');
  });

  it('returns null when the token has no email', () => {
    expect(idTokenEmail(idTokenWithPayload({ sub: 'apple-1' }))).toBeNull();
  });

  it('returns null for a malformed token', () => {
    expect(idTokenEmail('not-a-token')).toBeNull();
  });
});

describe('providerSignInFailure', () => {
  it('sends an email the nursery did not register to the not enabled screen', () => {
    expect(providerSignInFailure({ status: 403, message: 'account_not_enabled' })).toBe(SIGN_IN_FAILURES.NOT_ENABLED);
  });

  it('shows the offline banner when there is no connection', () => {
    expect(providerSignInFailure(new TypeError('Network request failed'))).toBe(SIGN_IN_FAILURES.NETWORK);
  });

  it('treats a rate limit as a provider error', () => {
    expect(providerSignInFailure({ status: 429, code: 'over_request_rate_limit' })).toBe(SIGN_IN_FAILURES.OTHER);
  });

  it('treats any other refusal as a provider error', () => {
    expect(providerSignInFailure({ status: 400, message: 'Bad ID token' })).toBe(SIGN_IN_FAILURES.OTHER);
  });
});
