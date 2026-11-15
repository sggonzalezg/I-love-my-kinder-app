const NATIONAL_ID_PATTERN = /^\d{8}$/;
const NATIONAL_ID_CHECK_WEIGHTS = [2, 9, 8, 7, 6, 3, 4];
const NATIONAL_ID_CHECK_DIGIT_INDEX = 7;

export const NATIONAL_ID_MESSAGES = {
  missing: 'Escribí su cédula.',
  invalid: 'Escribí la cédula con sus 8 números, con el dígito verificador.',
  wrongCheckDigit: 'Revisá la cédula: el dígito verificador no coincide.',
  taken: 'Esa cédula ya está cargada para otra persona del jardín.',
} as const;

/** Digits only, 8 of them, as the backend stores it ("4.876.543-8" → "48765438"). */
export function normalizeNationalId(text: string): string | null {
  const digits = text.replace(/\D/g, '');
  return NATIONAL_ID_PATTERN.test(digits) ? digits : null;
}

/** Same rule as the backend's `private.is_valid_national_id`, so a typo is caught before saving. */
export function hasValidNationalIdCheckDigit(digits: string): boolean {
  const weightedSum = NATIONAL_ID_CHECK_WEIGHTS.reduce((sum, weight, index) => sum + Number(digits[index]) * weight, 0);
  return (10 - (weightedSum % 10)) % 10 === Number(digits[NATIONAL_ID_CHECK_DIGIT_INDEX]);
}

export function nationalIdFieldError(text: string): string | null {
  if (!text.trim()) return NATIONAL_ID_MESSAGES.missing;
  const digits = normalizeNationalId(text);
  if (!digits) return NATIONAL_ID_MESSAGES.invalid;
  return hasValidNationalIdCheckDigit(digits) ? null : NATIONAL_ID_MESSAGES.wrongCheckDigit;
}

/** The backend's `create_*` functions raise these codes for the cédula. */
export function nationalIdSaveMessage(errorMessage: string): string | null {
  if (errorMessage.includes('national_id_taken')) return NATIONAL_ID_MESSAGES.taken;
  if (errorMessage.includes('national_id_wrong_check_digit')) return NATIONAL_ID_MESSAGES.wrongCheckDigit;
  if (errorMessage.includes('national_id_required')) return NATIONAL_ID_MESSAGES.missing;
  if (errorMessage.includes('national_id_invalid')) return NATIONAL_ID_MESSAGES.invalid;
  return null;
}
