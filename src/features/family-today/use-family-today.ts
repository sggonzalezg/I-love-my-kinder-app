import { loadFamilyToday, type FamilyToday } from '@/data/family-today';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';

export interface FamilyTodayState {
  familyToday: FamilyToday | null;
  offline: boolean;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function useFamilyToday(): FamilyTodayState {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const load = useAsync(() => loadFamilyToday(userId!, new Date()), userId);
  useReloadOnRefocus(load.reload);

  return {
    familyToday: load.data?.value ?? null,
    offline: load.data?.offline ?? false,
    loading: load.loading,
    failed: load.failed,
    reload: load.reload,
  };
}
