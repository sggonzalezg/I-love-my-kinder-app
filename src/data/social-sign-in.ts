import * as AppleAuthentication from 'expo-apple-authentication';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { availableProviders, idTokenEmail, SOCIAL_PROVIDERS, type SocialProvider } from '@/lib/social-sign-in';

import { supabase } from './supabase';

export interface ProviderSignIn {
  userId: string;
  email: string;
}

/** Thrown when the account the person chose is refused, so the screen can show it on C1. */
export class ProviderAccountError extends Error {
  constructor(
    readonly authError: unknown,
    readonly emailTried: string | null,
  ) {
    super('Provider sign-in refused');
  }
}

const APPLE_CANCELLED_CODE = 'ERR_REQUEST_CANCELED';
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';

function isGoogleSetUp(): boolean {
  const runsInExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
  if (runsInExpoGo || Platform.OS === 'web' || !GOOGLE_WEB_CLIENT_ID) return false;
  return Platform.OS !== 'ios' || Boolean(GOOGLE_IOS_CLIENT_ID);
}

// The Google sign-in is a native module that Expo Go and the web do not have; loading it lazily keeps the entry working there.
async function loadGoogleSignIn() {
  const googleSignIn = await import('@react-native-google-signin/google-signin');
  googleSignIn.GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID, iosClientId: GOOGLE_IOS_CLIENT_ID || undefined });
  return googleSignIn;
}

export async function fetchAvailableProviders(): Promise<SocialProvider[]> {
  const appleAvailable = Platform.OS === 'ios' && (await AppleAuthentication.isAvailableAsync());
  return availableProviders({ appleAvailable, googleAvailable: isGoogleSetUp() });
}

async function signInWithProviderToken(provider: SocialProvider, idToken: string, emailTried: string | null): Promise<ProviderSignIn> {
  const { data, error } = await supabase.auth.signInWithIdToken({ provider, token: idToken });
  if (error || !data.user) throw new ProviderAccountError(error ?? new Error('signInWithIdToken returned no user'), emailTried);
  return { userId: data.user.id, email: data.user.email ?? emailTried ?? '' };
}

/** Supabase does not keep Apple's tokens; the refresh token is needed to revoke the access when the account is deleted (App Store 5.1.1(v)). */
async function registerAppleToken(authorizationCode: string | null): Promise<void> {
  if (!authorizationCode) return;
  const { error } = await supabase.functions.invoke('register-apple-token', { body: { authorizationCode } });
  if (error) console.warn('Apple token registration failed:', error);
}

/** Null when the person closed Apple's sheet without finishing. */
export async function signInWithApple(): Promise<ProviderSignIn | null> {
  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({ requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL] });
  } catch (error) {
    if ((error as { code?: string }).code === APPLE_CANCELLED_CODE) return null;
    throw error;
  }
  if (!credential.identityToken) throw new Error('Apple returned no identity token');
  const signedIn = await signInWithProviderToken(SOCIAL_PROVIDERS.APPLE, credential.identityToken, idTokenEmail(credential.identityToken));
  await registerAppleToken(credential.authorizationCode);
  return signedIn;
}

/** Null when the person closed Google's sheet without finishing. */
export async function signInWithGoogle(): Promise<ProviderSignIn | null> {
  const { GoogleSignin, isErrorWithCode, statusCodes } = await loadGoogleSignIn();
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (response.type !== 'success') return null;
    if (!response.data.idToken) throw new Error('Google returned no ID token');
    return await signInWithProviderToken(SOCIAL_PROVIDERS.GOOGLE, response.data.idToken, response.data.user.email.toLowerCase());
  } catch (error) {
    if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    throw error;
  } finally {
    // Only the Supabase session is kept, so the next sign-in lets the person pick another Google account.
    await GoogleSignin.signOut().catch((error: unknown) => console.warn('Google sign-out failed:', error));
  }
}
