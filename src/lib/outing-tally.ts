import type { OutingAnswerCounts } from './outing-form';

const SEPARATOR = ' · ';

export function childrenLabel(count: number): string {
  return count === 1 ? '1 niño' : `${count} niños`;
}

export function permissionCardTitle({ authorizedCount, childCount }: OutingAnswerCounts): string {
  return `${authorizedCount} de ${childCount} ${authorizedCount === 1 ? 'autorizó' : 'autorizaron'}`;
}

export function permissionCardDetail({ declinedCount, pendingCount }: OutingAnswerCounts): string | null {
  const parts = [
    declinedCount > 0 ? `${declinedCount} ${declinedCount === 1 ? 'no autoriza' : 'no autorizan'}` : null,
    pendingCount > 0 ? `${pendingCount} sin responder` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(SEPARATOR) : null;
}

export function isEveryAnswerIn({ pendingCount }: OutingAnswerCounts): boolean {
  return pendingCount === 0;
}

export function permissionRowChip({ authorizedCount, childCount }: OutingAnswerCounts): string {
  return `Permisos ${authorizedCount} de ${childCount}`;
}

export function voidedPermissionsLine(authorizedCount: number): string | null {
  if (authorizedCount === 0) return null;
  return authorizedCount === 1 ? 'El permiso firmado queda sin efecto' : `Los ${authorizedCount} permisos firmados quedan sin efecto`;
}

export function outingTimeLine(leaves: string, comesBack: string): string {
  return `Salen ${leaves}${SEPARATOR}vuelven ${comesBack}`;
}
