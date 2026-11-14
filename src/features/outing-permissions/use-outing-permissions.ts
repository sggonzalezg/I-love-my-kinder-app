import { useMemo } from 'react';

import { fetchOutingPermissions } from '@/data/outing-permission';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { childPermissionRows, permissionsSubtitle, type ChildPermissionRow } from '@/lib/outing-permissions';

export interface OutingPermissions {
  subtitle: string | null;
  rows: ChildPermissionRow[] | null;
  notFound: boolean;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useOutingPermissions(eventId: string | undefined): OutingPermissions {
  const load = useAsync(() => fetchOutingPermissions(eventId!), eventId ?? null, { keepDataOnReload: true });
  useReloadOnRefocus(load.reload);
  const outing = load.data;
  const rows = useMemo(() => (outing ? childPermissionRows(outing.answers, outing.children, outing.permissionVersion) : null), [outing]);
  return {
    subtitle: outing ? permissionsSubtitle(outing.title, outing.startsAt) : null,
    rows,
    notFound: !load.loading && !load.failed && outing === null,
    loading: load.loading && outing === null,
    failed: load.failed,
    reload: load.reload,
  };
}
