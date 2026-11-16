// Uruguay mobile numbers: 09X XXX XXX locally, +598 9X XXX XXX in E.164.

function nationalDigits(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('598')) digits = digits.slice(3);
  if (!digits.startsWith('0')) digits = `0${digits}`;
  return digits;
}

export function isValidUyMobile(input: string): boolean {
  return /^09\d{7}$/.test(nationalDigits(input));
}

export function toE164(input: string): string {
  return `+598${nationalDigits(input).slice(1)}`;
}

export function formatUyPhone(input: string): string {
  const d = nationalDigits(input);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
}

export function phoneError(input: string): string | null {
  return isValidUyMobile(input) ? null : 'Revisá el número: son 9 dígitos y empieza con 09.';
}

const URUGUAY_CALLING_CODE = '598';
const INTERNATIONAL_PREFIX = '+';
const UY_MOBILE_NATIONAL = /^9\d{7}$/;
const UY_LANDLINE_NATIONAL = /^[24]\d{7}$/;
/** The check of every phone column since backend migration 042. */
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

interface StoredPhoneOptions {
  /** Backend 045: the nursery contact is a messaging number, so a Uruguayan landline is refused there. */
  allowLandline: boolean;
}

function uruguayanNational(digits: string): string {
  return digits.replace(/^0+/, '');
}

/** Typed "094 555 010", "2222 2224" or "+54 9 11 1234 5678" → E.164; null when it is not a valid number. */
export function toStoredPhone(input: string, { allowLandline }: StoredPhoneOptions): string | null {
  const typed = input.trim();
  const digits = typed.replace(/\D/g, '');
  const isInternational = typed.startsWith(INTERNATIONAL_PREFIX);
  if (isInternational && !digits.startsWith(URUGUAY_CALLING_CODE)) {
    const phone = `${INTERNATIONAL_PREFIX}${digits}`;
    return E164_PATTERN.test(phone) ? phone : null;
  }
  const national = uruguayanNational(isInternational ? digits.slice(URUGUAY_CALLING_CODE.length) : digits);
  const isValid = UY_MOBILE_NATIONAL.test(national) || (allowLandline && UY_LANDLINE_NATIONAL.test(national));
  return isValid ? `${INTERNATIONAL_PREFIX}${URUGUAY_CALLING_CODE}${national}` : null;
}

/** Stored E.164 → how it is typed in Uruguay ("094 555 010", "2222 2224"); a foreign number stays as stored. */
export function toPhoneFieldValue(stored: string | null): string {
  if (!stored) return '';
  const uruguayanPrefix = `${INTERNATIONAL_PREFIX}${URUGUAY_CALLING_CODE}`;
  if (!stored.startsWith(uruguayanPrefix)) return stored;
  const national = stored.slice(uruguayanPrefix.length);
  if (UY_MOBILE_NATIONAL.test(national)) return formatUyPhone(stored);
  if (UY_LANDLINE_NATIONAL.test(national)) return `${national.slice(0, 4)} ${national.slice(4)}`;
  return stored;
}
