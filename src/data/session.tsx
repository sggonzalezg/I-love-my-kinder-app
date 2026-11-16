import { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthSession } from './types';
import { forgetDevicePushToken } from './push-tokens';
import { supabase } from './supabase';
import { SESSION_ACTIONS, initialSessionState, sessionReducer } from './session-reducer';
import type { Role } from '@/lib/role';
import { FAMILY_TODAY_STORAGE_KEY_PREFIX } from '@/constants/cache';
import { SESSION_STORAGE_KEY } from '@/constants/storage';

const SessionContext = createContext<{
  session: AuthSession | null;
  loading: boolean;
  isSignedIn: boolean;
  startSession: (session: AuthSession) => void;
  setActiveRole: (role: Role) => Promise<void>;
} | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [{ session, loading }, dispatch] = useReducer(sessionReducer, initialSessionState);

  function startSession(started: AuthSession) {
    dispatch({ type: SESSION_ACTIONS.STARTED, session: started });
  }

  async function setActiveRole(role: Role) {
    if (!session) return;
    dispatch({ type: SESSION_ACTIONS.ROLE_CHANGED, role });
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ ...session, active_role: role }));
  }

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      let restored: AuthSession | null = null;
      try {
        const cached = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (cached) restored = JSON.parse(cached);
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        if (isMounted) dispatch({ type: SESSION_ACTIONS.RESTORED, session: restored });
      }
    };

    restoreSession();

    const { data } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT' && isMounted) {
        dispatch({ type: SESSION_ACTIONS.ENDED });
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      }
    });

    return () => {
      isMounted = false;
      data?.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, isSignedIn: !!session, startSession, setActiveRole }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export async function signOut(): Promise<void> {
  await forgetDevicePushToken();
  await supabase.auth.signOut();
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  await forgetSavedFamilyToday();
}

async function forgetSavedFamilyToday(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith(FAMILY_TODAY_STORAGE_KEY_PREFIX)));
}

/** After the account is deleted the "deleted" screen stays until "Listo", but a restart must open the login. */
export async function forgetStoredSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}
