import { fetchSupervision } from '@/data/director-today';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import type { SupervisionGroup } from '@/lib/director-today';

export interface DirectorToday {
  groups: SupervisionGroup[] | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useDirectorToday(): DirectorToday {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const supervision = useAsync(() => fetchSupervision(nurseryId!, new Date()), nurseryId, { keepDataOnReload: true });
  useReloadOnRefocus(supervision.reload);
  return { groups: supervision.data, loading: supervision.loading && supervision.data === null, failed: supervision.failed, reload: supervision.reload };
}
