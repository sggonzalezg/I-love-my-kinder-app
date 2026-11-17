import { SIGN_IN_FAILURES, normalizeEmail, sendCodeFailure, type AuthFailure, type SignInFailure } from '@/lib/email-sign-in';

export const SOCIAL_PROVIDERS = {
  APPLE: 'apple',
  GOOGLE: 'google',
} as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[keyof typeof SOCIAL_PROVIDERS];

interface ProviderAvailability {
  appleAvailable: boolean;
  googleAvailable: boolean;
}

const BASE64URL_PATTERN = /[-_]/g;
const JWT_PAYLOAD_INDEX = 1;

/** App Store 4.8: Apple goes first and is offered wherever Google is, on the devices that support it. */
export function availableProviders({ appleAvailable, googleAvailable }: ProviderAvailability): SocialProvider[] {
  const providers: SocialProvider[] = [];
  if (appleAvailable) providers.push(SOCIAL_PROVIDERS.APPLE);
  if (googleAvailable) providers.push(SOCIAL_PROVIDERS.GOOGLE);
  return providers;
}

/** Apple sends the email in its credential only on the first sign-in, so the email tried is read from the ID token. */
export function idTokenEmail(idToken: string): string | null {
  const payload = idToken.split('.')[JWT_PAYLOAD_INDEX];
  if (!payload) return null;
  try {
    const claims = JSON.parse(atob(payload.replace(BASE64URL_PATTERN, (char) => (char === '-' ? '+' : '/'))));
    return typeof claims.email === 'string' ? normalizeEmail(claims.email) : null;
  } catch {
    return null;
  }
}

export function providerSignInFailure(failure: AuthFailure): SignInFailure {
  const kind = sendCodeFailure(failure);
  return kind === SIGN_IN_FAILURES.NOT_ENABLED || kind === SIGN_IN_FAILURES.NETWORK ? kind : SIGN_IN_FAILURES.OTHER;
}
