import { AUTHORIZATION_KEYS, type AuthorizationKey } from '@/lib/authorizations';
import { AUTHORIZATION_STATES } from '@/lib/child-authorizations';
import type { ChildAuthorizationItem } from '@/lib/child-authorization-status';

const TWO_GUARDIANS = 2;

export const CHILD_AUTHORIZATIONS_COPY = {
  title: (childFirstName: string) => `Autorizaciones de ${childFirstName}`,
  back: 'Volver',
  backToToday: 'Volver a Hoy',
  loadError: 'No pudimos cargar las autorizaciones.',
  retry: 'Reintentar',
  saved: 'Guardado',
};

export function focusKeyFromParam(focus: string | undefined): AuthorizationKey | null {
  return AUTHORIZATION_KEYS.find((key) => key === focus) ?? null;
}

/** Families cannot read the other guardian's row, so the name is known only once that guardian answered something. */
export function otherGuardianName(items: ChildAuthorizationItem[]): string | null {
  return items.find((item) => item.state !== AUTHORIZATION_STATES.unanswered && !item.answeredByMe && item.answeredByName)?.answeredByName ?? null;
}

export function authorizationsIntro(childFirstName: string, guardianCount: number): string | null {
  if (guardianCount < TWO_GUARDIANS) return null;
  const everyone = guardianCount === TWO_GUARDIANS ? 'los dos' : 'todos';
  return `Son de ${childFirstName}, no de cada adulto: lo que responde uno vale para ${everyone}. Podés cambiarlas cuando quieras.`;
}

export function authorizationsCaption(childFirstName: string, guardianCount: number, otherName: string | null): string | null {
  if (guardianCount < TWO_GUARDIANS) return null;
  const ending = `retira una, deja de valer para ${childFirstName}.`;
  if (guardianCount > TWO_GUARDIANS) return `Los otros adultos a cargo ven lo mismo. Si uno de ustedes ${ending}`;
  return `${otherName ?? 'El otro adulto a cargo'} ve lo mismo. Si uno de los dos ${ending}`;
}
