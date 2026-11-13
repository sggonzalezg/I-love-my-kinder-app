import { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthError, AuthSession } from './types';
import { supabase, invoke } from './supabase';
import { SESSION_ACTIONS, initialSessionState, sessionReducer } from './session-reducer';
import { resolveRoles, getActiveRole, type Role } from '@/lib/role';
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

// Phone lookup: check if the number is registered.
export async function lookupPhone(phone: string): Promise<{ user_id: string; name: string; inactive: boolean }> {
  try {
    const result = await invoke<{
      user_id: string;
      name: string;
      inactive: boolean;
    }>('auth-whatsapp', { phone });
    return result;
  } catch (err) {
    const error = err as Error & { status?: number };
    if (error.status === 404) throw { code: 'unknown_number', message: 'I love my kinder no activó tu cuenta aún' } as AuthError;
    if (error.message?.includes('inactive')) throw { code: 'inactive_teacher', message: 'Tu cuenta está inactiva' } as AuthError;
    throw { code: 'network', message: 'No pudimos conectar. Probá de nuevo.' } as AuthError;
  }
}

// Sign in with OTP.
export async function signInWithPhone(phone: string): Promise<void> {
  try {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  } catch (err) {
    throw { code: 'network', message: 'No pudimos enviar el código. Probá de nuevo.' } as AuthError;
  }
}

// Verify OTP and create session.
export async function verifyPhoneCode(phone: string, code: string): Promise<AuthSession> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
    if (error) {
      if (error.message?.includes('expired')) throw { code: 'expired_code', message: 'El código expiró. Reenvíalo.' } as AuthError;
      throw { code: 'invalid_code', message: 'El código no es correcto' } as AuthError;
    }

    const user = data.user;
    if (!user) throw { code: 'network', message: 'No pudimos verificar tu código. Probá de nuevo.' } as AuthError;

    // Fetch profile and resolve roles.
    const { data: familyData } = await supabase.from('family_members').select('*').eq('user_id', user.id).maybeSingle();
    const { data: teacherData } = await supabase.from('teachers').select('*').eq('user_id', user.id).maybeSingle();

    const profile = {
      user_id: user.id,
      family_members: familyData ? [familyData] : [],
      teachers: teacherData ? [teacherData] : [],
    };

    const roles = resolveRoles(profile);
    if (!roles.length) throw { code: 'unknown_number', message: 'Tu cuenta no tiene acceso' } as AuthError;

    // Get nursery info.
    const nurseryId = familyData?.nursery_id || teacherData?.nursery_id;
    const { data: nursery } = await supabase.from('nurseries').select('*').eq('id', nurseryId).single();

    const session: AuthSession = {
      user_id: user.id,
      phone,
      roles,
      active_role: getActiveRole(roles, null),
      nursery_id: nurseryId,
      nursery_urgent_phone: nursery?.urgent_phone || '',
      nursery_name: nursery?.name || 'I Love My Kinder',
      person_name: familyData?.name || teacherData?.name || '',
      profile_photo: familyData?.photo_path || teacherData?.photo_path,
    };

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  } catch (err) {
    const authError = err as AuthError;
    if (authError.code) throw authError;
    throw { code: 'network', message: 'No pudimos verificar tu código. Probá de nuevo.' } as AuthError;
  }
}

// Sign out.
export async function signOut(): Promise<void> {
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
