import {
  DELETION_ERROR_CODES,
  deletedOnLine,
  deletionErrorMessage,
  familyAccessLine,
  isCompleteDeletionCode,
  joinNames,
  soleTeacherGroupLabel,
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

  it('tells the only director to ask support for another direction person', () => {
    expect(deletionErrorMessage(DELETION_ERROR_CODES.ONLY_DIRECTOR)).toBe(
      'Sos la única cuenta de dirección. Pedile al soporte de la app que sume a otra persona de dirección con su e-mail.',
    );
  });

  it('asks to retry when Apple did not revoke the login', () => {
    expect(deletionErrorMessage(DELETION_ERROR_CODES.APPLE_REVOKE_FAILED)).toBe(
      'No pudimos completar la eliminación. Probá de nuevo.',
    );
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

describe('soleTeacherGroupLabel', () => {
  it('names the first group where the teacher is the only one', () => {
    const groups = [
      { roomName: 'Sala 1', shift: 'morning' as const, teacherCount: 2 },
      { roomName: 'Sala 2', shift: 'afternoon' as const, teacherCount: 1 },
    ];
    expect(soleTeacherGroupLabel(groups)).toBe('Sala 2 · Vespertino');
  });

  it('returns null when every group has another teacher', () => {
    expect(soleTeacherGroupLabel([{ roomName: 'Sala 1', shift: 'morning', teacherCount: 2 }])).toBeNull();
  });
});
