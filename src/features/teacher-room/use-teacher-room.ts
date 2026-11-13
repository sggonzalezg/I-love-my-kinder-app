import { useCallback } from 'react';

import { fetchRoomRoster, type RosterChild } from '@/data/family-room';
import { useSession } from '@/data/session';
import { fetchTeacherGroups, type TeacherGroup } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { chooseGroup, groupKeyOf } from '@/features/teacher-day/use-group-day';

export interface TeacherRoom {
  groups: TeacherGroup[];
  group: TeacherGroup | null;
  hasNoGroup: boolean;
  children: RosterChild[];
  /** Children per group, in the order of `groups`, for the room switch rows. */
  childCounts: number[] | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

/** Every roster of the teacher is read at once: the shown group lists its children and the others give the switch counts. */
export function useTeacherRoom(requestedGroupKey: string | null): TeacherRoom {
  const { session } = useSession();
  const userId = session?.user_id ?? null;

  const groups = useAsync(() => fetchTeacherGroups(userId!), userId);
  const groupList = groups.data ?? [];
  const group = chooseGroup(groupList, requestedGroupKey, new Date());

  const rosters = useAsync(() => Promise.all(groupList.map(fetchRoomRoster)), groupList.length ? groupList.map(groupKeyOf).join(',') : null);
  const shownIndex = group ? groupList.indexOf(group) : -1;

  const { reload: reloadGroups } = groups;
  const { reload: reloadRosters } = rosters;
  const reload = useCallback(() => {
    reloadGroups();
    reloadRosters();
  }, [reloadGroups, reloadRosters]);

  return {
    groups: groupList,
    group,
    hasNoGroup: groups.data !== null && groupList.length === 0,
    children: rosters.data?.[shownIndex]?.children ?? [],
    childCounts: rosters.data?.map((roster) => roster.children.length) ?? null,
    loading: groups.loading || (groupList.length > 0 && rosters.loading),
    failed: groups.failed || rosters.failed,
    reload,
  };
}
