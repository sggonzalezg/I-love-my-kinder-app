import { fetchDirectorGroupView } from '@/data/director-rooms';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';

export function useDirectorGroup(roomId: string, shiftId: string) {
  const group = useAsync(() => fetchDirectorGroupView(roomId, shiftId), `${roomId}:${shiftId}`, { keepDataOnReload: true });
  useReloadOnRefocus(group.reload);
  return group;
}
