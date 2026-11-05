import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Local stack by default (supabase start in repos/backend). Set both in .env for other environments.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Refresh tokens only while the app is in the foreground (Supabase React Native guidance).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Calls an edge function and throws its `error` message on failure. */
export async function invoke<T>(name: string, body: object): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message = error.message;
    try {
      const payload = await (error as { context?: Response }).context?.json();
      if (payload?.error) message = payload.error;
    } catch {}
    const err = new Error(message) as Error & { status?: number };
    err.status = (error as { context?: Response }).context?.status;
    throw err;
  }
  return data as T;
}

export const MEDIA_BUCKET = 'media';

export async function signedUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const { data } = await supabase.storage.from(MEDIA_BUCKET).createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}
