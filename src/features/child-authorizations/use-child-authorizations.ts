import { useCallback } from 'react';

import { AUTHORIZATION_ANSWER_SCREENS, answerChildAuthorization, fetchChildAuthorizationsContext } from '@/data/child-authorizations';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import type { AuthorizationKey } from '@/lib/authorizations';
import { childAuthorizationStatuses, type ChildAuthorizationStatus } from '@/lib/child-authorization-status';

export interface ChildAuthorizationsView {
  childFirstName: string;
  childFullName: string;
  guardianCount: number;
  status: ChildAuthorizationStatus;
}

export interface ChildAuthorizations {
  view: ChildAuthorizationsView | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
  answer: (key: AuthorizationKey, accepted: boolean) => Promise<void>;
}

export function useChildAuthorizations(childId: string): ChildAuthorizations {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const load = useAsync(() => fetchChildAuthorizationsContext(childId, userId!), userId ? `${userId}:${childId}` : null, { keepDataOnReload: true });
  const { reload } = load;

  const answer = useCallback(
    async (key: AuthorizationKey, accepted: boolean) => {
      await answerChildAuthorization({ childId, key, accepted, screen: AUTHORIZATION_ANSWER_SCREENS.childAuthorizations });
      reload();
    },
    [childId, reload],
  );

  const context = load.data;
  const view = context
    ? {
        childFirstName: context.childFirstName,
        childFullName: context.childFullName,
        guardianCount: context.guardianCount,
        status: childAuthorizationStatuses(context.rows, [childId], context.ownFirstName)[0],
      }
    : null;

  return { view, loading: load.loading && !context, failed: load.failed, reload, answer };
}
