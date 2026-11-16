import {
  AUTHORIZATION_REMINDERS_ACTIONS,
  authorizationRemindersReducer,
  initialAuthorizationRemindersState,
  type AuthorizationRemindersState,
} from '@/features/family-today/authorization-reminders-reducer';
import type { AuthorizationReminder } from '@/lib/authorization-reminders';

function reminder(childId: string, firstName: string): AuthorizationReminder {
  return { childId, firstName, lastName: 'Rodríguez', photoPath: null, missingKeys: ['health'], focusKey: 'health' };
}

const MATEO = reminder('child-mateo', 'Mateo');
const LUCIA = reminder('child-lucia', 'Lucía');

function loaded(state: AuthorizationRemindersState, reminders: AuthorizationReminder[]) {
  return authorizationRemindersReducer(state, { type: AUTHORIZATION_REMINDERS_ACTIONS.REMINDERS_LOADED, reminders });
}

function opened(state: AuthorizationRemindersState, childId: string) {
  return authorizationRemindersReducer(state, { type: AUTHORIZATION_REMINDERS_ACTIONS.REMINDER_OPENED, childId });
}

describe('authorizationRemindersReducer', () => {
  it('shows a card for each reminder on the first load', () => {
    const state = loaded(initialAuthorizationRemindersState, [MATEO, LUCIA]);

    expect(state.cards).toEqual([MATEO, LUCIA]);
  });

  it('keeps the card of a child just answered here in its place while it leaves', () => {
    const away = opened(loaded(initialAuthorizationRemindersState, [MATEO, LUCIA]), MATEO.childId);

    const back = loaded(away, [LUCIA]);

    expect(back.cards).toEqual([MATEO, LUCIA]);
    expect(back.leavingChildId).toBe(MATEO.childId);
  });

  it('does not treat a card answered by the other guardian while away as just finished', () => {
    const away = opened(loaded(initialAuthorizationRemindersState, [MATEO, LUCIA]), LUCIA.childId);

    const back = loaded(away, [LUCIA]);

    expect(back.cards).toEqual([LUCIA]);
    expect(back.leavingChildId).toBeNull();
  });

  it('keeps the card without leaving when the child still has something unanswered', () => {
    const away = opened(loaded(initialAuthorizationRemindersState, [MATEO]), MATEO.childId);

    const back = loaded(away, [MATEO]);

    expect(back.cards).toEqual([MATEO]);
    expect(back.leavingChildId).toBeNull();
    expect(back.openedChildId).toBeNull();
  });

  it('removes the leaving card and shows the toast with its name once it left', () => {
    const leaving = loaded(opened(loaded(initialAuthorizationRemindersState, [MATEO, LUCIA]), MATEO.childId), [LUCIA]);

    const left = authorizationRemindersReducer(leaving, { type: AUTHORIZATION_REMINDERS_ACTIONS.LEAVE_FINISHED });

    expect(left.cards).toEqual([LUCIA]);
    expect(left.leavingChildId).toBeNull();
    expect(left.finishedChildName).toBe('Mateo');
  });

  it('hides the toast when its time is up', () => {
    const leaving = loaded(opened(loaded(initialAuthorizationRemindersState, [MATEO]), MATEO.childId), []);
    const left = authorizationRemindersReducer(leaving, { type: AUTHORIZATION_REMINDERS_ACTIONS.LEAVE_FINISHED });

    expect(authorizationRemindersReducer(left, { type: AUTHORIZATION_REMINDERS_ACTIONS.TOAST_HIDDEN }).finishedChildName).toBeNull();
  });
});
