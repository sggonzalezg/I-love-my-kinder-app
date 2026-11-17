import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, type Dispatch } from 'react';

import { accountNotEnabledHref } from '@/constants/routes';
import { fetchAvailableProviders, ProviderAccountError, signInWithApple, signInWithGoogle, type ProviderSignIn } from '@/data/social-sign-in';
import { EMAIL_ENTRY_ACTIONS, type EmailEntryAction } from '@/features/email-sign-in/email-entry-reducer';
import { useCompleteSignIn } from '@/features/email-sign-in/use-complete-sign-in';
import { SIGN_IN_FAILURES, type AuthFailure } from '@/lib/email-sign-in';
import { providerSignInFailure, type SocialProvider } from '@/lib/social-sign-in';

const SIGN_IN_WITH: Record<SocialProvider, () => Promise<ProviderSignIn | null>> = {
  apple: signInWithApple,
  google: signInWithGoogle,
};

export function useProviderSignIn(dispatch: Dispatch<EmailEntryAction>) {
  const router = useRouter();
  const completeSignIn = useCompleteSignIn();

  useEffect(() => {
    fetchAvailableProviders()
      .then((providers) => dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDERS_LOADED, providers }))
      .catch((error: unknown) => console.warn('Sign-in providers check failed:', error));
  }, [dispatch]);

  return async function signInWithProvider(provider: SocialProvider): Promise<void> {
    dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDER_STARTED, provider });
    try {
      const signedIn = await SIGN_IN_WITH[provider]();
      if (!signedIn) {
        dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDER_CANCELLED });
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await completeSignIn(signedIn.userId, signedIn.email);
      dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDER_FINISHED });
    } catch (error) {
      const emailTried = error instanceof ProviderAccountError ? error.emailTried : null;
      const failure = providerSignInFailure((error instanceof ProviderAccountError ? error.authError : error) as AuthFailure);
      if (failure === SIGN_IN_FAILURES.NOT_ENABLED && emailTried) {
        dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDER_FINISHED });
        router.push(accountNotEnabledHref(emailTried));
        return;
      }
      if (failure !== SIGN_IN_FAILURES.NETWORK) console.warn(`${provider} sign-in failed:`, error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: EMAIL_ENTRY_ACTIONS.PROVIDER_FAILED, failure });
    }
  };
}
