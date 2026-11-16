import { authorizationReminders, unansweredCountOf } from '../authorization-reminders';
import type { ChildAuthorizationStateRow } from '../child-authorization-status';
import type { FamilyChild } from '../room-groups';

const MATEO: FamilyChild = { id: 'child-mateo', firstName: 'Mateo', lastName: 'Rodríguez', photoPath: 'mateo.jpg', groups: [] };
const LUCIA: FamilyChild = { id: 'child-lucia', firstName: 'Lucía', lastName: 'Rodríguez', photoPath: null, groups: [] };

function stateRow(childId: string, authorizationType: string, state: ChildAuthorizationStateRow['state'], unansweredCount: number): ChildAuthorizationStateRow {
  const answered = state !== 'unanswered';
  return {
    child_id: childId,
    authorization_type: authorizationType,
    state,
    answered_at: answered ? '2026-03-03T13:00:00Z' : null,
    answered_by_name: answered ? 'Pablo' : null,
    answered_by_relationship: answered ? 'father' : null,
    unanswered_count: unansweredCount,
  };
}

describe('authorizationReminders', () => {
  it('gives a card to a child with an unanswered authorization, focused on the first one missing', () => {
    const rows = [stateRow(MATEO.id, 'auth_image', 'granted', 1), stateRow(MATEO.id, 'auth_health', 'unanswered', 1)];

    expect(authorizationReminders([MATEO], rows)).toEqual([
      { childId: MATEO.id, firstName: 'Mateo', lastName: 'Rodríguez', photoPath: 'mateo.jpg', missingKeys: ['health'], focusKey: 'health' },
    ]);
  });

  it('gives no card to a child whose authorizations are all answered, even when every answer is No', () => {
    const rows = [stateRow(MATEO.id, 'auth_image', 'denied', 0), stateRow(MATEO.id, 'auth_health', 'denied', 0)];

    expect(authorizationReminders([MATEO], rows)).toEqual([]);
  });

  it('gives no card to a child the backend does not list, such as a withdrawn one', () => {
    const rows = [stateRow(LUCIA.id, 'auth_image', 'unanswered', 2), stateRow(LUCIA.id, 'auth_health', 'unanswered', 2)];

    expect(authorizationReminders([MATEO, LUCIA], rows).map((reminder) => reminder.childId)).toEqual([LUCIA.id]);
  });

  it('keeps the order of the children on Hoy', () => {
    const rows = [
      stateRow(LUCIA.id, 'auth_image', 'unanswered', 2),
      stateRow(LUCIA.id, 'auth_health', 'unanswered', 2),
      stateRow(MATEO.id, 'auth_image', 'unanswered', 1),
      stateRow(MATEO.id, 'auth_health', 'granted', 1),
    ];

    expect(authorizationReminders([MATEO, LUCIA], rows).map((reminder) => [reminder.firstName, reminder.missingKeys])).toEqual([
      ['Mateo', ['image']],
      ['Lucía', ['image', 'health']],
    ]);
  });
});

describe('unansweredCountOf', () => {
  it('reads the count the backend sends for the child', () => {
    const rows = [stateRow(LUCIA.id, 'auth_image', 'unanswered', 2), stateRow(LUCIA.id, 'auth_health', 'unanswered', 2)];

    expect(unansweredCountOf(rows, LUCIA.id)).toBe(2);
  });

  it('is zero for a child with no rows', () => {
    expect(unansweredCountOf([], MATEO.id)).toBe(0);
  });
});
