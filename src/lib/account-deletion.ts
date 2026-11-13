export const DELETION_CODE_LENGTH = 6;
export const RESEND_WAIT_SECONDS = 60;
export const RESEND_TICK_MS = 1000;

export const DELETION_ERROR_CODES = {
  INVALID_CODE: 'invalid_code',
  TOO_MANY_ATTEMPTS: 'too_many_attempts',
  RESEND_TOO_SOON: 'resend_too_soon',
  ONLY_DIRECTOR: 'only_director',
  APPLE_REVOKE_FAILED: 'apple_revoke_failed',
} as const;

const DELETION_FAILED_MESSAGE = 'No pudimos eliminar tu cuenta. Probá de nuevo.';

const MESSAGES_BY_CODE: Record<string, string> = {
  [DELETION_ERROR_CODES.INVALID_CODE]: 'El código no es correcto o venció. Pedí uno nuevo.',
  [DELETION_ERROR_CODES.TOO_MANY_ATTEMPTS]: 'Esperá un momento: probaste muchos códigos seguidos.',
  [DELETION_ERROR_CODES.RESEND_TOO_SOON]: 'Esperá un minuto para pedir otro código.',
  [DELETION_ERROR_CODES.ONLY_DIRECTOR]:
    'Sos la única cuenta de dirección. Pedile al soporte de la app que sume a otra persona de dirección con su e-mail.',
  [DELETION_ERROR_CODES.APPLE_REVOKE_FAILED]: 'No pudimos completar la eliminación. Probá de nuevo.',
};

const DIGITS_ONLY = /^\d+$/;

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

export function familyAccessLine(childNames: string[]): string {
  return `tu acceso a ${childNames.length ? joinNames(childNames) : 'tus hijos'}`;
}

export function deletionErrorMessage(code: string | undefined): string {
  return (code && MESSAGES_BY_CODE[code]) || DELETION_FAILED_MESSAGE;
}

export function isCompleteDeletionCode(code: string): boolean {
  return code.length === DELETION_CODE_LENGTH && DIGITS_ONLY.test(code);
}

const twoDigits = (value: number) => String(value).padStart(2, '0');

export function deletedOnLine(deletedAt: Date): string {
  const day = `${twoDigits(deletedAt.getDate())}/${twoDigits(deletedAt.getMonth() + 1)}/${deletedAt.getFullYear()}`;
  return `Eliminamos tu cuenta el ${day}. Si querés volver, pedile a la dirección que te dé de alta otra vez.`;
}
