import { useCallback } from 'react';

import { fetchMonthEvents, fetchUpcomingEvents } from '@/data/events';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import type { Event } from '@/lib/calendar';

export interface CalendarData {
  monthEvents: Event[];
  upcomingEvents: Event[];
  hasAnyEvent: boolean;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useCalendar(year: number, month: number): CalendarData {
  const { session } = useSession();
  const userId = session?.user_id ?? null;

  const monthLoad = useAsync(() => fetchMonthEvents(year, month, new Date()), userId ? `${userId}:${year}-${month}` : null, { keepDataOnReload: true });
  const upcomingLoad = useAsync(() => fetchUpcomingEvents(new Date()), userId, { keepDataOnReload: true });

  const { reload: reloadMonth } = monthLoad;
  const { reload: reloadUpcoming } = upcomingLoad;
  const reload = useCallback(() => {
    reloadMonth();
    reloadUpcoming();
  }, [reloadMonth, reloadUpcoming]);
  useReloadOnRefocus(reload);

  return {
    monthEvents: monthLoad.data?.events ?? [],
    upcomingEvents: upcomingLoad.data ?? [],
    hasAnyEvent: monthLoad.data?.hasAnyEvent ?? true,
    loading: monthLoad.data === null || upcomingLoad.data === null,
    failed: monthLoad.failed || upcomingLoad.failed,
    reload,
  };
}
