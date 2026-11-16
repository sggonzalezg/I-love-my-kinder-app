import { useReducer } from 'react';

import { fetchDirectorChildren } from '@/data/director-children';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { CHILDREN_LIST_ACTIONS, INITIAL_CHILDREN_LIST_STATE, childrenListReducer } from '@/features/director-children/children-list-reducer';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { activeChildrenLabel, buildChildEntries, filterChildren, roomFilterOptions } from '@/lib/director-children';

export function useDirectorChildren() {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const { data, loading, failed, reload } = useAsync(() => fetchDirectorChildren(nurseryId!), nurseryId, { keepDataOnReload: true });
  useReloadOnRefocus(reload);
  const [filters, dispatch] = useReducer(childrenListReducer, INITIAL_CHILDREN_LIST_STATE);

  const allChildren = data ? buildChildEntries(data, new Date()) : [];
  const shownChildren = filterChildren(allChildren, filters.query, filters.roomId);
  return {
    filters,
    roomOptions: roomFilterOptions(data?.rooms ?? [], DIRECTOR_CHILDREN_COPY.allRooms),
    hasChildren: allChildren.length > 0,
    shownChildren,
    countLine: activeChildrenLabel(shownChildren),
    loading: loading && !data,
    failed,
    reload,
    changeQuery: (query: string) => dispatch({ type: CHILDREN_LIST_ACTIONS.QUERY_CHANGED, query }),
    chooseRoom: (roomId: string) => dispatch({ type: CHILDREN_LIST_ACTIONS.ROOM_CHOSEN, roomId }),
  };
}
