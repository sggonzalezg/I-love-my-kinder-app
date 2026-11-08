import { fetchNoticeNeeded } from '@/data/consent';
import { useAsync } from '@/data/use-async';
import { CHAT_NOTICE_FAMILY, CHAT_NOTICE_STAFF } from '@/legal/texts';
import type { Role } from '@/lib/role';

export type ChatNoticeText = typeof CHAT_NOTICE_FAMILY | typeof CHAT_NOTICE_STAFF;

// The direction has no first-use notice: D5 draws none (open question for Seba).
const NOTICE_BY_ROLE: Record<Role, ChatNoticeText | null> = { family: CHAT_NOTICE_FAMILY, teacher: CHAT_NOTICE_STAFF, director: null };

/** Until the check answers, nothing shows; if it fails, the notice shows: asking twice is safer than not asking. */
export function useChatNotice(role: Role, userId: string | null) {
  const notice = NOTICE_BY_ROLE[role];
  const check = useAsync(() => fetchNoticeNeeded(userId!, notice!), notice && userId ? `${notice.id}:${userId}` : null);
  return {
    notice,
    checking: notice !== null && check.loading,
    needed: notice !== null && !check.loading && check.data !== false,
    recheck: check.reload,
  };
}
