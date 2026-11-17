import { useRouter } from 'expo-router';
import { useCallback, useEffect, useReducer } from 'react';

import { LOGIN_ROUTE } from '@/constants/routes';
import { acceptLoginDocument, fetchPendingLoginDocuments } from '@/data/consent';
import { routeAfterLoginConsent } from '@/data/first-sign-in-authorizations';
import { signOut, useSession } from '@/data/session';
import {
  initialLoginConsentState,
  LOGIN_CONSENT_ACTIONS,
  loginConsentReducer,
  uncheckedDocuments,
} from '@/features/login-consent/login-consent-reducer';
import type { LoginDocumentKey } from '@/lib/consent';

export function useLoginConsent() {
  const router = useRouter();
  const { session } = useSession();
  const userId = session?.user_id;
  const [state, dispatch] = useReducer(loginConsentReducer, initialLoginConsentState);

  const load = useCallback(async () => {
    if (!userId) return;
    dispatch({ type: LOGIN_CONSENT_ACTIONS.LOAD_STARTED });
    try {
      dispatch({ type: LOGIN_CONSENT_ACTIONS.LOADED, pending: await fetchPendingLoginDocuments(userId) });
    } catch (error) {
      console.warn('Login consent load failed:', error);
      dispatch({ type: LOGIN_CONSENT_ACTIONS.LOAD_FAILED });
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function continueToApp() {
    if (!session || state.saving) return;
    if (uncheckedDocuments(state).length) {
      dispatch({ type: LOGIN_CONSENT_ACTIONS.CONTINUE_REFUSED });
      return;
    }
    dispatch({ type: LOGIN_CONSENT_ACTIONS.SAVE_STARTED });
    try {
      for (const { key } of state.pending) {
        if (state.saved.includes(key)) continue;
        await acceptLoginDocument(key);
        dispatch({ type: LOGIN_CONSENT_ACTIONS.DOCUMENT_SAVED, key });
      }
      router.replace(await routeAfterLoginConsent(session));
    } catch (error) {
      console.warn('Login consent save failed:', error);
      dispatch({ type: LOGIN_CONSENT_ACTIONS.SAVE_FAILED });
    }
  }

  function toggleBox(key: LoginDocumentKey) {
    dispatch({ type: LOGIN_CONSENT_ACTIONS.BOX_TOGGLED, key });
  }

  async function signOutAndLeave() {
    await signOut();
    router.replace(LOGIN_ROUTE);
  }

  return { state, email: session?.email ?? '', load, continueToApp, toggleBox, signOutAndLeave };
}
