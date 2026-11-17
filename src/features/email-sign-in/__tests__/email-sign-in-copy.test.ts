import { SOCIAL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';
import { SOCIAL_PROVIDERS } from '@/lib/social-sign-in';

describe('SOCIAL_SIGN_IN_COPY', () => {
  it('names Google when the person closed it without finishing', () => {
    expect(SOCIAL_SIGN_IN_COPY.cancelled(SOCIAL_PROVIDERS.GOOGLE)).toBe('No terminaste de entrar con Google. Probá de nuevo o usá tu e-mail.');
  });

  it('names Apple when it answered with an error', () => {
    expect(SOCIAL_SIGN_IN_COPY.failed(SOCIAL_PROVIDERS.APPLE)).toBe('No pudimos entrar con Apple. Probá de nuevo o entrá con tu e-mail.');
  });
});
