import { NATIONAL_ID_MESSAGES, hasValidNationalIdCheckDigit, nationalIdFieldError, nationalIdSaveMessage, normalizeNationalId } from '../national-id';

describe('normalizeNationalId', () => {
  it('keeps only the 8 digits of a written cédula', () => {
    expect(normalizeNationalId('4.876.543-8')).toBe('48765438');
  });

  it('refuses a cédula without its 8 digits', () => {
    expect(normalizeNationalId('876.543-8')).toBeNull();
  });
});

describe('hasValidNationalIdCheckDigit', () => {
  it('accepts a matching check digit', () => {
    expect(hasValidNationalIdCheckDigit('48765438')).toBe(true);
  });

  it('refuses a wrong check digit', () => {
    expect(hasValidNationalIdCheckDigit('48765437')).toBe(false);
  });
});

describe('nationalIdFieldError', () => {
  it('asks for an empty cédula', () => {
    expect(nationalIdFieldError('  ')).toBe(NATIONAL_ID_MESSAGES.missing);
  });

  it('asks for the 8 digits', () => {
    expect(nationalIdFieldError('4.876.543')).toBe(NATIONAL_ID_MESSAGES.invalid);
  });

  it('flags a wrong check digit', () => {
    expect(nationalIdFieldError('4.876.543-7')).toBe(NATIONAL_ID_MESSAGES.wrongCheckDigit);
  });

  it('accepts a valid cédula', () => {
    expect(nationalIdFieldError('4.876.543-8')).toBeNull();
  });
});

describe('nationalIdSaveMessage', () => {
  it('maps a taken cédula', () => {
    expect(nationalIdSaveMessage('national_id_taken')).toBe(NATIONAL_ID_MESSAGES.taken);
  });

  it('maps a wrong check digit', () => {
    expect(nationalIdSaveMessage('national_id_wrong_check_digit')).toBe(NATIONAL_ID_MESSAGES.wrongCheckDigit);
  });

  it('leaves other errors alone', () => {
    expect(nationalIdSaveMessage('network down')).toBeNull();
  });
});
