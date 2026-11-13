import type { AuthSession } from '@/data/types';
import type { Role } from '@/lib/role';

export interface SessionState {
  session: AuthSession | null;
  loading: boolean;
}

export const SESSION_ACTIONS = {
  RESTORED: 'restored',
  STARTED: 'started',
  ROLE_CHANGED: 'roleChanged',
  ENDED: 'ended',
} as const;

export type SessionAction =
  | { type: typeof SESSION_ACTIONS.RESTORED; session: AuthSession | null }
  | { type: typeof SESSION_ACTIONS.STARTED; session: AuthSession }
  | { type: typeof SESSION_ACTIONS.ROLE_CHANGED; role: Role }
  | { type: typeof SESSION_ACTIONS.ENDED };

export const initialSessionState: SessionState = { session: null, loading: true };

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case SESSION_ACTIONS.RESTORED:
    case SESSION_ACTIONS.STARTED:
      return { session: action.session, loading: false };
    case SESSION_ACTIONS.ROLE_CHANGED:
      if (!state.session) return state;
      return { ...state, session: { ...state.session, active_role: action.role } };
    case SESSION_ACTIONS.ENDED:
      return { session: null, loading: false };
  }
}
