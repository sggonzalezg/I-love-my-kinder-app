import { fetchOwnWorkHours } from '@/data/chat';
import { useAsync } from '@/data/use-async';
import { isOffWorkHours } from '@/lib/chat';
import type { Role } from '@/lib/role';

import { CHAT_COPY } from './chat-copy';

/** Only teachers: their working hours decide when chat notifications reach them (design T12). */
export function useOffHoursText(role: Role, userId: string | null): string | null {
  const hours = useAsync(() => fetchOwnWorkHours(userId!), role === 'teacher' && userId ? userId : null);
  if (!hours.data || !isOffWorkHours(new Date(), hours.data)) return null;
  return CHAT_COPY.offHours(hours.data);
}
