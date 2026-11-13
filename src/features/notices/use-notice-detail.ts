import { useEffect } from 'react';

import { fetchFamilyChildren } from '@/data/family-room';
import { fetchNotice, fetchNoticeImageUrl, markNoticeSeen } from '@/data/notices';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { childrenInAudience, type Notice } from '@/lib/notices';

export interface NoticeDetail {
  notice: Notice | null;
  userId: string | null;
  isFamily: boolean;
  /** The family's children the notice went to, for the void outing permission line. */
  audienceChildren: string[];
  imageUrl: string | null;
  imageUrlFailed: boolean;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useNoticeDetail(noticeId: string | undefined, imageAttempt: number): NoticeDetail {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const isFamily = session?.active_role === 'family';

  const notice = useAsync(() => fetchNotice(noticeId!), noticeId ?? null);
  const children = useAsync(() => fetchFamilyChildren(userId!), isFamily ? userId : null);
  const imagePath = notice.data?.imagePath ?? null;
  const imageUrl = useAsync(() => fetchNoticeImageUrl(imagePath!), imagePath ? `${imagePath}#${imageAttempt}` : null);

  const loadedNoticeId = notice.data?.id ?? null;
  useEffect(() => {
    if (!isFamily || !loadedNoticeId) return;
    markNoticeSeen(loadedNoticeId).catch((error: unknown) => console.warn('Marking the notice seen failed:', error));
  }, [isFamily, loadedNoticeId]);

  return {
    notice: notice.data,
    userId,
    isFamily,
    audienceChildren: notice.data && children.data ? childrenInAudience(children.data, notice.data) : [],
    imageUrl: imageUrl.data,
    imageUrlFailed: imageUrl.failed,
    loading: notice.loading,
    failed: notice.failed || (!notice.loading && notice.data === null),
    reload: notice.reload,
  };
}
