import {
  answeredLine,
  authorizationPurpose,
  childAuthorizationStatuses,
  firstSignInFooterLine,
  firstUnansweredKey,
  missingAuthorizationsLine,
  readOnlyAnsweredLine,
  unansweredBannerText,
  unansweredChipLabel,
  type ChildAuthorizationStateRow,
} from '../child-authorization-status';
import { AUTHORIZATION_STATES } from '../child-authorizations';

const MATEO = 'child-mateo';
const LUCIA = 'child-lucia';

function row(overrides: Partial<ChildAuthorizationStateRow>): ChildAuthorizationStateRow {
  return {
    child_id: MATEO,
    authorization_type: 'auth_image',
    state: 'granted',
    answered_at: '2026-03-03T13:00:00Z',
    answered_by_name: 'Pablo',
    answered_by_relationship: 'father',
    unanswered_count: 1,
    ...overrides,
  };
}

const unanswered = (authorizationType: string, childId = MATEO) =>
  row({ child_id: childId, authorization_type: authorizationType, state: 'unanswered', answered_at: null, answered_by_name: null, answered_by_relationship: null });

describe('childAuthorizationStatuses', () => {
  it('lists both documents as unanswered for a child with no rows', () => {
    const [status] = childAuthorizationStatuses([], [MATEO], 'Ana');

    expect(status.items.map((item) => [item.key, item.state])).toEqual([
      ['image', AUTHORIZATION_STATES.unanswered],
      ['health', AUTHORIZATION_STATES.unanswered],
    ]);
  });

  it('counts a child with no rows as two unanswered', () => {
    expect(childAuthorizationStatuses([], [MATEO], 'Ana')[0].unansweredCount).toBe(2);
  });

  it('keeps a granted answer with who answered and when', () => {
    const [status] = childAuthorizationStatuses([row({})], [MATEO], 'Ana');

    expect(status.items[0]).toEqual({
      key: 'image',
      state: AUTHORIZATION_STATES.granted,
      answeredAt: '2026-03-03T13:00:00Z',
      answeredByName: 'Pablo',
      answeredByRelationship: 'father',
      answeredByMe: false,
    });
  });

  it('keeps a denied answer as denied', () => {
    const [status] = childAuthorizationStatuses([row({ authorization_type: 'auth_health', state: 'denied' })], [MATEO], 'Ana');

    expect(status.items[1].state).toBe(AUTHORIZATION_STATES.denied);
  });

  it('marks an answer given by the signed-in person as hers', () => {
    const [status] = childAuthorizationStatuses([row({ answered_by_name: 'Ana', answered_by_relationship: 'mother' })], [MATEO], 'Ana');

    expect(status.items[0].answeredByMe).toBe(true);
  });

  it('ignores rows of a removed authorization type', () => {
    const [status] = childAuthorizationStatuses([row({ authorization_type: 'auth_visibility', state: 'granted' })], [MATEO], 'Ana');

    expect(status.unansweredCount).toBe(2);
  });

  it('returns one status per child in the order asked', () => {
    const statuses = childAuthorizationStatuses([row({ child_id: LUCIA })], [MATEO, LUCIA], 'Ana');

    expect(statuses.map((status) => [status.childId, status.unansweredCount])).toEqual([
      [MATEO, 2],
      [LUCIA, 1],
    ]);
  });
});

describe('firstUnansweredKey', () => {
  it('returns the first unanswered document in screen order', () => {
    const [status] = childAuthorizationStatuses([unanswered('auth_image'), unanswered('auth_health')], [MATEO], 'Ana');

    expect(firstUnansweredKey(status)).toBe('image');
  });

  it('skips answered documents', () => {
    const [status] = childAuthorizationStatuses([row({})], [MATEO], 'Ana');

    expect(firstUnansweredKey(status)).toBe('health');
  });

  it('returns null when everything is answered', () => {
    const [status] = childAuthorizationStatuses([row({}), row({ authorization_type: 'auth_health', state: 'denied' })], [MATEO], 'Ana');

    expect(firstUnansweredKey(status)).toBeNull();
  });
});

describe('missingAuthorizationsLine', () => {
  it('names one missing authorization', () => {
    expect(missingAuthorizationsLine(['health'])).toBe('Falta responder datos de salud.');
  });

  it('joins two missing authorizations with "y"', () => {
    expect(missingAuthorizationsLine(['image', 'health'])).toBe('Falta responder imagen en redes sociales y datos de salud.');
  });
});

describe('unansweredBannerText', () => {
  it('uses the singular for one answer', () => {
    expect(unansweredBannerText(1)).toBe('Falta 1 respuesta. Elegí Sí o No en cada una.');
  });

  it('uses the plural for two answers', () => {
    expect(unansweredBannerText(2)).toBe('Faltan 2 respuestas. Elegí Sí o No en cada una.');
  });
});

describe('firstSignInFooterLine', () => {
  it('counts what is left of the child in the plural', () => {
    expect(firstSignInFooterLine(2, 'Mateo')).toBe('Faltan 2 de Mateo. Si seguís, te las recordamos en Hoy.');
  });

  it('counts what is left of the child in the singular', () => {
    expect(firstSignInFooterLine(1, 'Mateo')).toBe('Falta 1 de Mateo. Si seguís, te las recordamos en Hoy.');
  });

  it('says every authorization of the child is answered', () => {
    expect(firstSignInFooterLine(0, 'Mateo')).toBe('Respondiste las 2 de Mateo.');
  });
});

describe('answeredLine', () => {
  it('names the other guardian and the day', () => {
    const [status] = childAuthorizationStatuses([row({})], [MATEO], 'Ana');

    expect(answeredLine(status.items[0])).toBe('Lo respondió Pablo (padre) · 03/03/2026');
  });

  it('says "vos" for an own yes', () => {
    const [status] = childAuthorizationStatuses([row({ answered_by_name: 'Ana', answered_by_relationship: 'mother' })], [MATEO], 'Ana');

    expect(answeredLine(status.items[0])).toBe('Lo autorizaste vos · 03/03/2026');
  });

  it('says it was not authorized for an own no', () => {
    const [status] = childAuthorizationStatuses([row({ state: 'denied', answered_by_name: 'Ana' })], [MATEO], 'Ana');

    expect(answeredLine(status.items[0])).toBe('No lo autorizaste · 03/03/2026');
  });

  it('leaves out an unknown relationship', () => {
    const [status] = childAuthorizationStatuses([row({ answered_by_relationship: null })], [MATEO], 'Ana');

    expect(answeredLine(status.items[0])).toBe('Lo respondió Pablo · 03/03/2026');
  });

  it('has no line while unanswered', () => {
    const [status] = childAuthorizationStatuses([], [MATEO], 'Ana');

    expect(answeredLine(status.items[0])).toBeNull();
  });
});

describe('readOnlyAnsweredLine', () => {
  it('says who already answered and where to change it', () => {
    const [status] = childAuthorizationStatuses([row({})], [MATEO], 'Ana');

    expect(readOnlyAnsweredLine(status.items[0])).toBe('Ya lo respondió Pablo (padre) el 03/03/2026. Podés cambiarlo en Perfil.');
  });
});

describe('unansweredChipLabel', () => {
  it('counts the unanswered authorizations', () => {
    expect(unansweredChipLabel(2)).toBe('Falta responder 2');
  });
});

describe('authorizationPurpose', () => {
  it('names the child in the image purpose', () => {
    expect(authorizationPurpose('image', 'Mateo')).toBe(
      'Publicar fotos y videos de Mateo en el Instagram del jardín. No cambia lo que se ve en la galería ni en el chat.',
    );
  });

  it('names the child in the health purpose', () => {
    expect(authorizationPurpose('health', 'Mateo')).toBe('Las alergias de Mateo, solo para sus maestras y la dirección. No estás obligado a darlas.');
  });
});
