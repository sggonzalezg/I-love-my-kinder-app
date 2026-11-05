import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthError, AuthSession } from './types';
import { supabase, invoke } from './supabase';
import { resolveRoles, getActiveRole, type Role } from '@/lib/role';

const SessionContext = createContext<{
  session: AuthSession | null;
  loading: boolean;
  isSignedIn: boolean;
  setActiveRole: (role: Role) => Promise<void>;
} | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
    const { data } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        await AsyncStorage.removeItem('session');
      }
    });
    return () => data?.subscription.unsubscribe();
  }, []);

  async function restoreSession() {
    try {
      const cached = await AsyncStorage.getItem('session');
      if (cached) setSession(JSON.parse(cached));
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setLoading(false);
    }
  }

  async function setActiveRole(role: Role) {
    if (!session) return;
    const updated = { ...session, active_role: role };
    setSession(updated);
    await AsyncStorage.setItem('session', JSON.stringify(updated));
  }

  return (
    <SessionContext.Provider value={{ session, loading, isSignedIn: !!session, setActiveRole }}>
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

    await AsyncStorage.setItem('session', JSON.stringify(session));
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
  await AsyncStorage.removeItem('session');
}
