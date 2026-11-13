import type { AuthSession } from '@/data/types';

import { SESSION_ACTIONS, initialSessionState, sessionReducer } from '../session-reducer';

const familySession: AuthSession = {
  user_id: 'user-1',
  phone: '+59899123456',
  roles: ['family', 'teacher'],
  active_role: 'family',
  nursery_id: 'nursery-1',
  nursery_urgent_phone: '+59829000000',
  nursery_name: 'I Love My Kinder',
  person_name: 'Ana',
};

describe('sessionReducer (root session guard)', () => {
  it('starts loading with no session, so nothing is routed yet', () => {
    expect(initialSessionState).toEqual({ session: null, loading: true });
  });

  it('opens the login when no session was saved', () => {
    const state = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: null });
    expect(state).toEqual({ session: null, loading: false });
  });

  it('opens the app with the saved session', () => {
    const state = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: familySession });
    expect(state).toEqual({ session: familySession, loading: false });
  });

  it('lets the app open right after the login code is verified', () => {
    const signedOut = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: null });
    const state = sessionReducer(signedOut, { type: SESSION_ACTIONS.STARTED, session: familySession });
    expect(state.session).toBe(familySession);
  });

  it('switches the active role of the current session', () => {
    const signedIn = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: familySession });
    const state = sessionReducer(signedIn, { type: SESSION_ACTIONS.ROLE_CHANGED, role: 'teacher' });
    expect(state.session?.active_role).toBe('teacher');
  });

  it('ignores a role change with no session', () => {
    const signedOut = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: null });
    expect(sessionReducer(signedOut, { type: SESSION_ACTIONS.ROLE_CHANGED, role: 'teacher' })).toBe(signedOut);
  });

  it('drops the session on sign out or account deletion, so the guard sends to login', () => {
    const signedIn = sessionReducer(initialSessionState, { type: SESSION_ACTIONS.RESTORED, session: familySession });
    const state = sessionReducer(signedIn, { type: SESSION_ACTIONS.ENDED });
    expect(state).toEqual({ session: null, loading: false });
  });
});
