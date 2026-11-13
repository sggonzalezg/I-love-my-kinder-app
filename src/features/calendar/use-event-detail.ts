import { fetchEvent } from '@/data/events';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import type { Event } from '@/lib/calendar';

export interface EventDetail {
  event: Event | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useEventDetail(eventId: string | undefined): EventDetail {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const load = useAsync(() => fetchEvent(eventId!, userId!, new Date()), eventId && userId ? `${userId}:${eventId}` : null);
  return { event: load.data, loading: load.loading, failed: load.failed, reload: load.reload };
}
