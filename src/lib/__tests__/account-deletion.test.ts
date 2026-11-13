import {
  DELETION_ERROR_CODES,
  deletedOnLine,
  deletionErrorMessage,
  familyAccessLine,
  isCompleteDeletionCode,
  joinNames,
} from '../account-deletion';

describe('joinNames', () => {
  it('returns a single name as is', () => {
    expect(joinNames(['Mateo'])).toBe('Mateo');
  });

  it('joins two names with "y"', () => {
    expect(joinNames(['Mateo', 'Lucía'])).toBe('Mateo y Lucía');
  });

  it('joins three or more names with commas and a last "y"', () => {
    expect(joinNames(['Ana', 'Mateo', 'Lucía'])).toBe('Ana, Mateo y Lucía');
  });
});

describe('familyAccessLine', () => {
  it('names the children the family loses access to', () => {
    expect(familyAccessLine(['Mateo', 'Lucía'])).toBe('tu acceso a Mateo y Lucía');
  });

  it('falls back to "tus hijos" when the children are not loaded', () => {
    expect(familyAccessLine([])).toBe('tu acceso a tus hijos');
  });
});

describe('deletionErrorMessage', () => {
  it('explains a wrong or expired code', () => {
    expect(deletionErrorMessage(DELETION_ERROR_CODES.INVALID_CODE)).toBe('El código no es correcto o venció. Pedí uno nuevo.');
  });

  it('asks to wait after too many codes', () => {
    expect(deletionErrorMessage(DELETION_ERROR_CODES.TOO_MANY_ATTEMPTS)).toBe('Esperá un momento: probaste muchos códigos seguidos.');
  });

  it('asks to wait before another code is sent', () => {
    expect(deletionErrorMessage(DELETION_ERROR_CODES.RESEND_TOO_SOON)).toBe('Esperá un minuto para pedir otro código.');
  });

  it('uses the design error for anything else', () => {
    expect(deletionErrorMessage('server_error')).toBe('No pudimos eliminar tu cuenta. Probá de nuevo.');
    expect(deletionErrorMessage(undefined)).toBe('No pudimos eliminar tu cuenta. Probá de nuevo.');
  });
});

describe('isCompleteDeletionCode', () => {
  it('accepts exactly six digits', () => {
    expect(isCompleteDeletionCode('518207')).toBe(true);
  });

  it('rejects a short code', () => {
    expect(isCompleteDeletionCode('51820')).toBe(false);
  });
});

describe('deletedOnLine', () => {
  it('says the day the account was deleted as dd/mm/yyyy and how to come back', () => {
    expect(deletedOnLine(new Date(2026, 9, 5))).toBe(
      'Eliminamos tu cuenta el 05/10/2026. Si querés volver, pedile a la dirección que te dé de alta otra vez.',
    );
  });
});
