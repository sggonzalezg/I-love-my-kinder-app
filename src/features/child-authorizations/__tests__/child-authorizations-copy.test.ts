import {
  authorizationsCaption,
  authorizationsIntro,
  focusKeyFromParam,
  otherGuardianName,
} from '@/features/child-authorizations/child-authorizations-copy';
import { AUTHORIZATION_STATES } from '@/lib/child-authorizations';
import type { ChildAuthorizationItem } from '@/lib/child-authorization-status';

function item(overrides: Partial<ChildAuthorizationItem>): ChildAuthorizationItem {
  return {
    key: 'image',
    state: AUTHORIZATION_STATES.granted,
    answeredAt: '2026-03-03T12:00:00Z',
    answeredByName: 'Pablo',
    answeredByRelationship: 'father',
    answeredByMe: false,
    ...overrides,
  };
}

describe('focusKeyFromParam', () => {
  it('returns the document named by the focus param', () => {
    expect(focusKeyFromParam('health')).toBe('health');
  });

  it('ignores an unknown document', () => {
    expect(focusKeyFromParam('visibility')).toBeNull();
  });

  it('ignores a missing param', () => {
    expect(focusKeyFromParam(undefined)).toBeNull();
  });
});

describe('otherGuardianName', () => {
  it('takes the name of the other guardian who answered', () => {
    expect(otherGuardianName([item({ answeredByMe: true, answeredByName: 'Ana' }), item({})])).toBe('Pablo');
  });

  it('is null when only the signed-in guardian answered', () => {
    expect(otherGuardianName([item({ answeredByMe: true, answeredByName: 'Ana' })])).toBeNull();
  });

  it('is null when nothing is answered', () => {
    expect(otherGuardianName([item({ state: AUTHORIZATION_STATES.unanswered, answeredByName: null })])).toBeNull();
  });
});

describe('authorizationsIntro', () => {
  it('is left out for a child with one guardian', () => {
    expect(authorizationsIntro('Lucía', 1)).toBeNull();
  });

  it('says the answer counts for both with two guardians', () => {
    expect(authorizationsIntro('Mateo', 2)).toBe(
      'Son de Mateo, no de cada adulto: lo que responde uno vale para los dos. Podés cambiarlas cuando quieras.',
    );
  });

  it('says the answer counts for all with more guardians', () => {
    expect(authorizationsIntro('Mateo', 3)).toBe(
      'Son de Mateo, no de cada adulto: lo que responde uno vale para todos. Podés cambiarlas cuando quieras.',
    );
  });
});

describe('authorizationsCaption', () => {
  it('is left out for a child with one guardian', () => {
    expect(authorizationsCaption('Lucía', 1, null)).toBeNull();
  });

  it('names the other guardian when known', () => {
    expect(authorizationsCaption('Mateo', 2, 'Pablo')).toBe('Pablo ve lo mismo. Si uno de los dos retira una, deja de valer para Mateo.');
  });

  it('speaks of the other adult when the name is not known', () => {
    expect(authorizationsCaption('Mateo', 2, null)).toBe(
      'El otro adulto a cargo ve lo mismo. Si uno de los dos retira una, deja de valer para Mateo.',
    );
  });

  it('speaks of the other adults with more guardians', () => {
    expect(authorizationsCaption('Mateo', 3, 'Pablo')).toBe(
      'Los otros adultos a cargo ven lo mismo. Si uno de ustedes retira una, deja de valer para Mateo.',
    );
  });
});
