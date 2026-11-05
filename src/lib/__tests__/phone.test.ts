import { formatUyPhone, isValidUyMobile, phoneError, toE164 } from '../phone';

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
