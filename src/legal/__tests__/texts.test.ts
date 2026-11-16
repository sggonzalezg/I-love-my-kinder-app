import { CONSENT } from '../texts';

describe('CONSENT', () => {
  it('shows the privacy checkbox of consent-texts.md v1.21 word for word', () => {
    expect(`${CONSENT.privacyBefore}${CONSENT.privacyLink}${CONSENT.privacyAfter}`).toBe(
      'Leí la Política de privacidad y autorizo el tratamiento de mis datos personales para las finalidades que allí se indican, incluido su alojamiento en Brasil y el envío de mi mail y de las notificaciones a proveedores en Estados Unidos.',
    );
  });

  it('shows the terms checkbox word for word', () => {
    expect(`${CONSENT.termsBefore}${CONSENT.termsLink}${CONSENT.termsAfter}`).toBe('Leí y acepto los Términos y condiciones.');
  });
});
