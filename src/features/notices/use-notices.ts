import { useCallback } from 'react';

import { fetchFamilyChildren } from '@/data/family-room';
import { fetchFamilyNotices, fetchSenderLabels, fetchStaffNotices } from '@/data/notices';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { NO_SENDER_LABELS, type Notice } from '@/lib/notices';
import type { FamilyChild } from '@/lib/room-groups';

export interface NoticesList {
  notices: Notice[];
  userId: string | null;
  isFamily: boolean;
  /** Names of the senders, known only to the direction. */
  senderLabels: ReadonlyMap<string, string>;
  /** Names of the family's children when none has an open group (read-only list); empty otherwise. */
  withdrawnChildren: string[];
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

function withdrawnChildNames(children: FamilyChild[] | null): string[] {
  if (!children?.length || children.some((child) => child.groups.length > 0)) return [];
  return children.map((child) => child.firstName);
}

function otherSenders(notices: Notice[] | null, userId: string | null): string[] {
  const senders = (notices ?? []).flatMap((notice) => (notice.createdBy && notice.createdBy !== userId ? [notice.createdBy] : []));
  return [...new Set(senders)].sort();
}

export function useNotices(): NoticesList {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const isFamily = session?.active_role === 'family';
  const requestKey = userId && session ? `${session.active_role}:${userId}` : null;

  const notices = useAsync(() => (isFamily ? fetchFamilyNotices(userId!) : fetchStaffNotices()), requestKey, { keepDataOnReload: true });
  const children = useAsync(() => fetchFamilyChildren(userId!), isFamily ? userId : null);
  const senderIds = session?.active_role === 'director' ? otherSenders(notices.data, userId) : [];
  const senderLabels = useAsync(() => fetchSenderLabels(senderIds), senderIds.length ? senderIds.join(',') : null);

  const { reload: reloadNotices } = notices;
  const { reload: reloadChildren } = children;
  const reload = useCallback(() => {
    reloadNotices();
    if (isFamily) reloadChildren();
  }, [isFamily, reloadNotices, reloadChildren]);
  useReloadOnRefocus(reloadNotices);

  return {
    notices: notices.data ?? [],
    userId,
    isFamily,
    senderLabels: senderLabels.data ?? NO_SENDER_LABELS,
    withdrawnChildren: withdrawnChildNames(children.data),
    loading: notices.loading && notices.data === null,
    failed: notices.failed,
    reload,
  };
}
