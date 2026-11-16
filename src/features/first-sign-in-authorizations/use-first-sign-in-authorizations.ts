import { useCallback } from 'react';

import { AUTHORIZATION_ANSWER_SCREENS, answerChildAuthorization } from '@/data/child-authorizations';
import { fetchFirstSignInAuthorizations, type FirstSignInAuthorizations } from '@/data/first-sign-in-authorizations';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import type { AuthorizationKey } from '@/lib/authorizations';

export interface FirstSignInAuthorizationsLoad {
  data: FirstSignInAuthorizations | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
  answer: (childId: string, key: AuthorizationKey, accepted: boolean) => Promise<void>;
}

export function useFirstSignInAuthorizations(): FirstSignInAuthorizationsLoad {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const load = useAsync(() => fetchFirstSignInAuthorizations(userId!), userId, { keepDataOnReload: true });
  const { reload } = load;

  const answer = useCallback(
    async (childId: string, key: AuthorizationKey, accepted: boolean) => {
      await answerChildAuthorization({ childId, key, accepted, screen: AUTHORIZATION_ANSWER_SCREENS.firstSignIn });
      reload();
    },
    [reload],
  );

  return { data: load.data, loading: load.loading && !load.data, failed: load.failed, reload, answer };
}
