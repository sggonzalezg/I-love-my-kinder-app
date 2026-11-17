import { CONSENT } from '@/legal/texts';
import type { LoginDocumentKey } from '@/lib/consent';

export const LOGIN_CONSENT_COPY = {
  title: 'Antes de empezar',
  intro: 'Para usar la app necesitamos que leas y aceptes estos dos documentos. Podés verlos cuando quieras en Perfil.',
  continue: 'Continuar',
  saving: 'Guardando…',
  bothMissing: 'Necesitamos que aceptes las dos para seguir',
  saveFailed: 'No pudimos guardar. Probá de nuevo.',
  notMe: 'No soy yo · Salir',
  loadFailed: 'No pudimos cargar los documentos.',
  retry: 'Reintentar',
} as const;

const DOCUMENT_NAMES: Record<LoginDocumentKey, string> = {
  terms: `los ${CONSENT.termsLink}`,
  privacy: `la ${CONSENT.privacyLink}`,
};

export function missingConsentMessage(missing: LoginDocumentKey[], pendingCount: number): string | null {
  if (!missing.length) return null;
  if (missing.length > 1 && missing.length === pendingCount) return LOGIN_CONSENT_COPY.bothMissing;
  return `Falta aceptar ${DOCUMENT_NAMES[missing[0]]}`;
}

export function updatedDocumentNotice(key: LoginDocumentKey, date: string): string {
  return CONSENT.updated(DOCUMENT_NAMES[key], date);
}
