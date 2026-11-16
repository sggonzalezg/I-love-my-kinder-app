import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Href } from 'expo-router';

import { LOGIN_CONSENT_ROUTE } from '@/constants/routes';
import { SESSION_STORAGE_KEY } from '@/constants/storage';
import { getDocumentsToAccept, LOGIN_DOCUMENT_IDS, type LoginConsentRecord } from '@/lib/consent';
import { isReviewEmail } from '@/lib/email-sign-in';
import { linkedProfile, type PersonRow, type TeacherRow } from '@/lib/session-profile';

import { routeAfterLoginConsent } from './first-sign-in-authorizations';
import { invoke, supabase } from './supabase';
import { throwOnError } from './throw-on-error';
import type { AuthSession } from './types';

const PERSON_COLUMNS = 'id, nursery_id, first_name, last_name, photo_path';
const DIRECTOR_COLUMNS = 'id, nursery_id, first_name, last_name';
const DEFAULT_NURSERY_NAME = 'I Love My Kinder';

interface NurseryContact {
  name: string;
  urgent_phone: string | null;
}

// Store reviewers cannot read a mailbox: their email takes the fixed code of `review-sign-in` instead.
// Unset in every build that is not sent to a store review, so the path is off.
const REVIEW_ACCOUNT_EMAIL = process.env.EXPO_PUBLIC_REVIEW_ACCOUNT_EMAIL;
const REVIEW_SIGN_IN_FUNCTION = 'review-sign-in';

interface ReviewSignInResponse {
  session: { access_token: string; refresh_token: string };
}

/** The before-user-created hook only lets registered emails create an account, so no code reaches anyone else. */
export async function sendEmailCode(email: string): Promise<void> {
  if (isReviewEmail(email, REVIEW_ACCOUNT_EMAIL)) return;
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) throw error;
}

async function verifyReviewCode(email: string, code: string): Promise<string> {
  const { session } = await invoke<ReviewSignInResponse>(REVIEW_SIGN_IN_FUNCTION, { email, code });
  const { data, error } = await supabase.auth.setSession(session);
  if (error) throw error;
  if (!data.user) throw new Error('setSession returned no user');
  return data.user.id;
}

export async function verifyEmailCode(email: string, code: string): Promise<string> {
  if (isReviewEmail(email, REVIEW_ACCOUNT_EMAIL)) return verifyReviewCode(email, code);
  const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
  if (error) throw error;
  if (!data.user) throw new Error('verifyOtp returned no user');
  return data.user.id;
}

/** Null when the account has no access left; it is signed out so the stored Supabase session goes too. */
export async function startSignedInSession(userId: string, email: string): Promise<AuthSession | null> {
  const [familyMembers, teachers, directors] = await Promise.all([
    supabase.from('family_members').select(PERSON_COLUMNS).eq('user_id', userId).then((result) => throwOnError<PersonRow[]>(result)),
    supabase.from('teachers').select(`${PERSON_COLUMNS}, status`).eq('user_id', userId).then((result) => throwOnError<TeacherRow[]>(result)),
    supabase.from('directors').select(DIRECTOR_COLUMNS).eq('user_id', userId).then((result) => throwOnError<PersonRow[]>(result)),
  ]);

  const profile = linkedProfile({ familyMembers, teachers, directors });
  if (!profile) {
    await supabase.auth.signOut();
    return null;
  }

  const nursery = await supabase.from('nurseries').select('name, urgent_phone').eq('id', profile.nurseryId).maybeSingle().then((result) => throwOnError<NurseryContact | null>(result));
  const session: AuthSession = {
    user_id: userId,
    email,
    roles: profile.roles,
    active_role: profile.activeRole,
    nursery_id: profile.nurseryId,
    nursery_urgent_phone: nursery?.urgent_phone ?? '',
    nursery_name: nursery?.name ?? DEFAULT_NURSERY_NAME,
    person_name: profile.personName,
    profile_photo: profile.photoPath ?? undefined,
  };
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export async function routeAfterSignIn(session: AuthSession): Promise<Href> {
  const records = await supabase
    .from('consent_records')
    .select('document_type, document_version, accepted')
    .eq('user_id', session.user_id)
    .in('document_type', LOGIN_DOCUMENT_IDS)
    .then((result) => throwOnError<LoginConsentRecord[]>(result));
  if (getDocumentsToAccept(records ?? []).length) return LOGIN_CONSENT_ROUTE;
  return routeAfterLoginConsent(session);
}
