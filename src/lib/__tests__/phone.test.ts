import { formatUyPhone, isValidUyMobile, phoneError, toE164, toPhoneFieldValue, toStoredPhone } from '../phone';

describe('Uruguay mobile phone helpers', () => {
  it('accepts a 9-digit number starting with 09, ignoring spaces', () => {
    expect(isValidUyMobile('099 123 456')).toBe(true);
  });

  it('accepts the number without the leading 0', () => {
    expect(isValidUyMobile('99123456')).toBe(true);
  });

  it('rejects a short number', () => {
    expect(isValidUyMobile('099 12')).toBe(false);
  });

  it('rejects a landline (does not start with 09)', () => {
    expect(isValidUyMobile('029123456')).toBe(false);
  });

  it('converts to E.164 with +598 and no leading 0', () => {
    expect(toE164('099 123 456')).toBe('+59899123456');
  });

  it('formats for display as 099 123 456', () => {
    expect(formatUyPhone('+59899123456')).toBe('099 123 456');
  });

  it('returns the design copy as the error for an invalid number', () => {
    expect(phoneError('099 12')).toBe('Revisá el número: son 9 dígitos y empieza con 09.');
  });

  it('returns no error for a valid number', () => {
    expect(phoneError('099123456')).toBeNull();
  });
});

describe('nursery phone fields', () => {
  it('stores a Uruguayan mobile typed with spaces in E.164', () => {
    expect(toStoredPhone('094 555 010', { allowLandline: false })).toBe('+59894555010');
  });

  it('stores a Uruguayan landline when landlines are allowed', () => {
    expect(toStoredPhone('2222 2224', { allowLandline: true })).toBe('+59822222224');
  });

  it('refuses a Uruguayan landline for a messaging number', () => {
    expect(toStoredPhone('2222 2224', { allowLandline: false })).toBeNull();
  });

  it('keeps an international number typed with +', () => {
    expect(toStoredPhone('+54 9 11 1234 5678', { allowLandline: false })).toBe('+5491112345678');
  });

  it('reads a +598 number as Uruguayan', () => {
    expect(toStoredPhone('+598 2222 2224', { allowLandline: false })).toBeNull();
  });

  it('refuses a short number', () => {
    expect(toStoredPhone('094 55', { allowLandline: true })).toBeNull();
  });

  it('shows a stored Uruguayan mobile the local way', () => {
    expect(toPhoneFieldValue('+59894555010')).toBe('094 555 010');
  });

  it('shows a stored Uruguayan landline the local way', () => {
    expect(toPhoneFieldValue('+59822222224')).toBe('2222 2224');
  });

  it('shows a foreign number as stored', () => {
    expect(toPhoneFieldValue('+5491112345678')).toBe('+5491112345678');
  });

  it('shows nothing for a missing number', () => {
    expect(toPhoneFieldValue(null)).toBe('');
  });
});
