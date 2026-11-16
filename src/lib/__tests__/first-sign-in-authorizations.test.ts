import type { ChildAuthorizationItem, ChildAuthorizationStateRow } from '../child-authorization-status';
import { AUTHORIZATION_STATES } from '../child-authorizations';
import {
  childGroupsLine,
  firstSignInStepChildIds,
  isAnsweredByAnotherGuardian,
  isFirstSignInAuthorizationsDue,
} from '../first-sign-in-authorizations';
import type { FamilyChild } from '../room-groups';

const SALA_2_MORNING = { roomId: 'room-2', roomName: 'Sala 2', shiftId: 'shift-am', shift: 'morning' as const };
const SALA_1_AFTERNOON = { roomId: 'room-1', roomName: 'Sala 1', shiftId: 'shift-pm', shift: 'afternoon' as const };

function kid(id: string, groups = [SALA_2_MORNING]): FamilyChild {
  return { id, firstName: id, lastName: 'Rodríguez', photoPath: null, groups };
}

function stateRow(childId: string, unansweredCount: number): ChildAuthorizationStateRow {
  return {
    child_id: childId,
    authorization_type: 'auth_image',
    state: unansweredCount > 0 ? 'unanswered' : 'granted',
    answered_at: null,
    answered_by_name: null,
    answered_by_relationship: null,
    unanswered_count: unansweredCount,
  };
}

function item(overrides: Partial<ChildAuthorizationItem>): ChildAuthorizationItem {
  return {
    key: 'image',
    state: AUTHORIZATION_STATES.granted,
    answeredAt: '2026-03-03T13:00:00Z',
    answeredByName: 'Pablo',
    answeredByRelationship: 'father',
    answeredByMe: false,
    ...overrides,
  };
}

describe('firstSignInStepChildIds', () => {
  it('gives one step per child with something unanswered, in the Hoy order', () => {
    const kids = [kid('mateo'), kid('lucia')];
    const rows = [stateRow('lucia', 2), stateRow('mateo', 1)];

    expect(firstSignInStepChildIds(kids, rows)).toEqual(['mateo', 'lucia']);
  });

  it('skips a child whose authorizations are all answered', () => {
    const kids = [kid('mateo'), kid('lucia')];
    const rows = [stateRow('mateo', 0), stateRow('lucia', 2)];

    expect(firstSignInStepChildIds(kids, rows)).toEqual(['lucia']);
  });

  it('skips a child the backend does not list, as one no longer enrolled', () => {
    const kids = [kid('mateo'), kid('lucia')];

    expect(firstSignInStepChildIds(kids, [stateRow('lucia', 2)])).toEqual(['lucia']);
  });

  it('skips a child with no open group', () => {
    expect(firstSignInStepChildIds([kid('mateo', [])], [stateRow('mateo', 2)])).toEqual([]);
  });
});

describe('isFirstSignInAuthorizationsDue', () => {
  it('is due for a family with a step to answer', () => {
    expect(isFirstSignInAuthorizationsDue('family', ['mateo'])).toBe(true);
  });

  it('is not due when every child is answered', () => {
    expect(isFirstSignInAuthorizationsDue('family', [])).toBe(false);
  });

  it('is never due for a teacher', () => {
    expect(isFirstSignInAuthorizationsDue('teacher', ['mateo'])).toBe(false);
  });

  it('is never due for the direction', () => {
    expect(isFirstSignInAuthorizationsDue('director', ['mateo'])).toBe(false);
  });
});

describe('isAnsweredByAnotherGuardian', () => {
  it('is true for an answer of the other guardian', () => {
    expect(isAnsweredByAnotherGuardian(item({}))).toBe(true);
  });

  it('is false for an answer of the signed-in guardian', () => {
    expect(isAnsweredByAnotherGuardian(item({ answeredByMe: true }))).toBe(false);
  });

  it('is false for an unanswered authorization', () => {
    expect(isAnsweredByAnotherGuardian(item({ state: AUTHORIZATION_STATES.unanswered, answeredByName: null }))).toBe(false);
  });
});

describe('childGroupsLine', () => {
  it('names the room and shift of the child', () => {
    expect(childGroupsLine([SALA_2_MORNING])).toBe('Sala 2 · Matutino');
  });

  it('joins every open group of the child', () => {
    expect(childGroupsLine([SALA_2_MORNING, SALA_1_AFTERNOON])).toBe('Sala 2 · Matutino, Sala 1 · Vespertino');
  });
});
