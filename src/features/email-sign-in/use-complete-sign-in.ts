import { useRouter } from 'expo-router';

import { ACCOUNT_DEACTIVATED_ROUTE } from '@/constants/routes';
import { routeAfterSignIn, startSignedInSession } from '@/data/email-sign-in';
import { useSession } from '@/data/session';

/** The same after the email code, Google or Apple: the session comes from the rows the nursery linked to the account. */
export function useCompleteSignIn() {
  const router = useRouter();
  const { startSession } = useSession();

  return async function completeSignIn(userId: string, email: string): Promise<void> {
    const session = await startSignedInSession(userId, email);
    if (!session) {
      router.replace(ACCOUNT_DEACTIVATED_ROUTE);
      return;
    }
    startSession(session);
    router.replace(await routeAfterSignIn(session));
  };
}
