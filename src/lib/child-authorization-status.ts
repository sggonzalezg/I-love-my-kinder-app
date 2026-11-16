import { CHILD_AUTHORIZATIONS } from '@/legal/texts';

import { AUTHORIZATION_KEYS, type AuthorizationKey } from './authorizations';
import { AUTHORIZATION_STATES, type AuthorizationAnswer } from './child-authorizations';
import { formatNumericDate } from './dates';
import { relationshipWord } from './format';

export interface ChildAuthorizationStateRow {
  child_id: string;
  authorization_type: string;
  state: AuthorizationAnswer;
  answered_at: string | null;
  answered_by_name: string | null;
  answered_by_relationship: string | null;
  unanswered_count: number;
}

export interface ChildAuthorizationItem {
  key: AuthorizationKey;
  state: AuthorizationAnswer;
  answeredAt: string | null;
  answeredByName: string | null;
  answeredByRelationship: string | null;
  answeredByMe: boolean;
}

export interface ChildAuthorizationStatus {
  childId: string;
  items: ChildAuthorizationItem[];
  unansweredCount: number;
}

const UNANSWERED_ITEM = { state: AUTHORIZATION_STATES.unanswered, answeredAt: null, answeredByName: null, answeredByRelationship: null, answeredByMe: false };

function toItem(key: AuthorizationKey, row: ChildAuthorizationStateRow | undefined, ownFirstName: string): ChildAuthorizationItem {
  if (!row || row.state === AUTHORIZATION_STATES.unanswered) return { key, ...UNANSWERED_ITEM };
  return {
    key,
    state: row.state,
    answeredAt: row.answered_at,
    answeredByName: row.answered_by_name,
    answeredByRelationship: row.answered_by_relationship,
    // shortcut: the backend row has no "answered by me" flag, so the first name decides; two guardians with the same first name read as "vos". Upgrade when backend adds the flag.
    answeredByMe: row.answered_by_name !== null && row.answered_by_name === ownFirstName,
  };
}

/** Every child gets both documents, in screen order; a document with no row is unanswered, never a "No". */
export function childAuthorizationStatuses(rows: ChildAuthorizationStateRow[], childIds: string[], ownFirstName: string): ChildAuthorizationStatus[] {
  return childIds.map((childId) => {
    const items = AUTHORIZATION_KEYS.map((key) =>
      toItem(
        key,
        rows.find((candidate) => candidate.child_id === childId && candidate.authorization_type === CHILD_AUTHORIZATIONS[key].id),
        ownFirstName,
      ),
    );
    return { childId, items, unansweredCount: items.filter((item) => item.state === AUTHORIZATION_STATES.unanswered).length };
  });
}

export function firstUnansweredKey(status: ChildAuthorizationStatus): AuthorizationKey | null {
  return status.items.find((item) => item.state === AUTHORIZATION_STATES.unanswered)?.key ?? null;
}

const AUTHORIZATION_NOUNS: Record<AuthorizationKey, string> = {
  image: 'imagen en redes sociales',
  health: 'datos de salud',
};

const AUTHORIZATION_PURPOSES: Record<AuthorizationKey, (child: string) => string> = {
  image: (child) => `Publicar fotos y videos de ${child} en el Instagram del jardín. No cambia lo que se ve en la galería ni en el chat.`,
  health: (child) => `Las alergias de ${child}, solo para sus maestras y la dirección. No estás obligado a darlas.`,
};

export function authorizationPurpose(key: AuthorizationKey, childFirstName: string): string {
  return AUTHORIZATION_PURPOSES[key](childFirstName);
}

export function missingAuthorizationsLine(keys: AuthorizationKey[]): string {
  const nouns = keys.map((key) => AUTHORIZATION_NOUNS[key]);
  const list = nouns.length > 1 ? `${nouns.slice(0, -1).join(', ')} y ${nouns[nouns.length - 1]}` : nouns[0];
  return `Falta responder ${list}.`;
}

export function unansweredBannerText(count: number): string {
  const missing = count === 1 ? 'Falta 1 respuesta' : `Faltan ${count} respuestas`;
  return `${missing}. Elegí Sí o No en cada una.`;
}

export function firstSignInFooterLine(unansweredCount: number, childFirstName: string): string {
  if (unansweredCount === 0) return `Respondiste las ${AUTHORIZATION_KEYS.length} de ${childFirstName}.`;
  const missing = unansweredCount === 1 ? 'Falta 1' : `Faltan ${unansweredCount}`;
  return `${missing} de ${childFirstName}. Si seguís, te las recordamos en Hoy.`;
}

function answererLabel(item: ChildAuthorizationItem): string {
  const relationship = item.answeredByRelationship ? ` (${relationshipWord(item.answeredByRelationship)})` : '';
  return `${item.answeredByName ?? ''}${relationship}`;
}

function answeredDate(item: ChildAuthorizationItem): string {
  return item.answeredAt ? formatNumericDate(new Date(item.answeredAt)) : '';
}

export function answeredLine(item: ChildAuthorizationItem): string | null {
  if (item.state === AUTHORIZATION_STATES.unanswered) return null;
  if (item.answeredByMe) {
    const verb = item.state === AUTHORIZATION_STATES.granted ? 'Lo autorizaste vos' : 'No lo autorizaste';
    return `${verb} · ${answeredDate(item)}`;
  }
  return `Lo respondió ${answererLabel(item)} · ${answeredDate(item)}`;
}

export function readOnlyAnsweredLine(item: ChildAuthorizationItem): string {
  return `Ya lo respondió ${answererLabel(item)} el ${answeredDate(item)}. Podés cambiarlo en Perfil.`;
}

export function unansweredChipLabel(count: number): string {
  return `Falta responder ${count}`;
}
