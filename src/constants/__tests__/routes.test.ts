import { AUTHORIZATIONS_FROM_TODAY, childAuthorizationsHref } from '../routes';

describe('childAuthorizationsHref', () => {
  it('opens the child authorizations with only the name when no reminder sent it', () => {
    expect(childAuthorizationsHref('child-mateo', 'Mateo')).toEqual({
      pathname: '/authorizations/[childId]',
      params: { childId: 'child-mateo', name: 'Mateo' },
    });
  });

  it('focuses the first unanswered authorization and marks Hoy as the origin when a reminder sent it', () => {
    expect(childAuthorizationsHref('child-mateo', 'Mateo', 'health')).toEqual({
      pathname: '/authorizations/[childId]',
      params: { childId: 'child-mateo', name: 'Mateo', focus: 'health', from: AUTHORIZATIONS_FROM_TODAY },
    });
  });
});
