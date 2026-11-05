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
