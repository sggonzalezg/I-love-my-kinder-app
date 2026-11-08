import { fetchUnreadChatCount } from '@/data/chat';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';

/** How many room chats have messages the user has not read, for the chat icon on Hoy. */
export function useUnreadChatThreads(userId: string | null): number {
  const unread = useAsync(() => fetchUnreadChatCount(userId!), userId);
  useReloadOnRefocus(unread.reload);
  return unread.data ?? 0;
}
