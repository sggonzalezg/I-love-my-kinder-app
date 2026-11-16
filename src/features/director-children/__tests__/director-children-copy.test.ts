import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { AUTHORIZATION_STATES } from '@/lib/child-authorizations';

describe('authorizationState', () => {
  it('reads a granted authorization as yes', () => {
    expect(DIRECTOR_CHILDREN_COPY.authorizationState('Redes', AUTHORIZATION_STATES.granted)).toBe('Redes: sí');
  });

  it('reads a denied authorization as no', () => {
    expect(DIRECTOR_CHILDREN_COPY.authorizationState('Redes', AUTHORIZATION_STATES.denied)).toBe('Redes: no');
  });

  it('reads an unanswered authorization as not answered', () => {
    expect(DIRECTOR_CHILDREN_COPY.authorizationState('Salud', AUTHORIZATION_STATES.unanswered)).toBe('Salud: sin responder');
  });
});
