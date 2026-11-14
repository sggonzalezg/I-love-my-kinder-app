import { useMemo } from 'react';

import { fetchOutingPermissions } from '@/data/outing-permission';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { childPermissionRows, isOutingDay, outingDaySubtitle, permissionsSubtitle, type ChildPermissionRow } from '@/lib/outing-permissions';

export interface OutingPermissions {
  subtitle: string | null;
  rows: ChildPermissionRow[] | null;
  outingDay: boolean;
  notFound: boolean;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useOutingPermissions(eventId: string | undefined): OutingPermissions {
  const load = useAsync(() => fetchOutingPermissions(eventId!), eventId ?? null, { keepDataOnReload: true });
  useReloadOnRefocus(load.reload);
  const outing = load.data;
  const view = useMemo(() => {
    if (!outing) return null;
    const outingDay = isOutingDay(outing.startsAt, new Date());
    return {
      outingDay,
      subtitle: outingDay ? outingDaySubtitle(outing.startsAt, outing.endsAt) : permissionsSubtitle(outing.title, outing.startsAt),
      rows: childPermissionRows(outing.answers, outing.children, outing.permissionVersion, { withWeekday: !outingDay }),
    };
  }, [outing]);
  return {
    subtitle: view?.subtitle ?? null,
    rows: view?.rows ?? null,
    outingDay: view?.outingDay ?? false,
    notFound: !load.loading && !load.failed && outing === null,
    loading: load.loading && outing === null,
    failed: load.failed,
    reload: load.reload,
  };
}
