import { LOGIN_CONSENT_COPY, missingConsentMessage, updatedDocumentNotice } from '@/features/login-consent/login-consent-copy';

describe('missingConsentMessage', () => {
  it('names the privacy policy when only it is missing', () => {
    expect(missingConsentMessage(['privacy'], 2)).toBe('Falta aceptar la Política de privacidad');
  });

  it('names the terms when only they are missing', () => {
    expect(missingConsentMessage(['terms'], 2)).toBe('Falta aceptar los Términos y condiciones');
  });

  it('asks for both when neither box is checked', () => {
    expect(missingConsentMessage(['terms', 'privacy'], 2)).toBe(LOGIN_CONSENT_COPY.bothMissing);
  });

  it('names the only document asked again after a new version', () => {
    expect(missingConsentMessage(['privacy'], 1)).toBe('Falta aceptar la Política de privacidad');
  });

  it('is null when nothing is missing', () => {
    expect(missingConsentMessage([], 2)).toBeNull();
  });
});

describe('updatedDocumentNotice', () => {
  it('says which document changed and when, with legal’s wording', () => {
    expect(updatedDocumentNotice('privacy', '16/11/2026')).toBe(
      'Actualizamos la Política de privacidad el 16/11/2026. Leelo y aceptalo para seguir usando la app.',
    );
  });
});
