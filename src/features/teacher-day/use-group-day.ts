import { useCallback } from 'react';

import { LAST_HYGIENE_LOOKBACK_DAYS } from '@/constants/routine';
import { fetchRoomRoster } from '@/data/family-room';
import { useRoutineQueue, type RoutineQueueState } from '@/data/routine-queue-store';
import { useSession } from '@/data/session';
import { fetchGroupRoutines, fetchTeacherGroups, type GroupRoutine, type TeacherGroup } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { toIsoDate } from '@/lib/dates';
import type { ChildGroup } from '@/lib/room-groups';
import { defaultDraft, draftFromRoutine, lastHygieneKind, type RoutineDraft, type RoutineTarget } from '@/lib/routine';
import { childSyncStatus, routineKey, type ChildSyncStatus } from '@/lib/routine-queue';
import { defaultGroupIndex } from '@/lib/teacher-day';

export interface GroupDayChild {
  id: string;
  name: string;
  firstName: string;
  photoPath: string | null;
  allergies: string | null;
  target: RoutineTarget;
  status: ChildSyncStatus;
  /** What the log opens with: the queued draft, the saved routine, or the defaults. */
  draft: RoutineDraft;
  savedAt: string | null;
}

export interface GroupDay {
  groups: TeacherGroup[];
  group: TeacherGroup | null;
  hasNoGroup: boolean;
  children: GroupDayChild[];
  queue: RoutineQueueState;
  loading: boolean;
  failed: boolean;
  reload: () => void;
}

export function groupKeyOf(group: Pick<ChildGroup, 'roomId' | 'shiftId'>): string {
  return `${group.roomId}:${group.shiftId}`;
}

function daysBefore(date: Date, days: number): Date {
  const earlier = new Date(date);
  earlier.setDate(date.getDate() - days);
  return earlier;
}

/** The teacher's group (the requested one, else the one of the current shift) with each child's day and sync status. */
export function useGroupDay(requestedGroupKey: string | null): GroupDay {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const queue = useRoutineQueue();
  const now = new Date();
  const today = toIsoDate(now);

  const groups = useAsync(() => fetchTeacherGroups(userId!), userId);
  const groupList = groups.data ?? [];
  const group = groupList.find((candidate) => groupKeyOf(candidate) === requestedGroupKey) ?? groupList[defaultGroupIndex(groupList, now)] ?? null;

  const day = useAsync(
    () => Promise.all([fetchRoomRoster(group!), fetchGroupRoutines(group!, toIsoDate(daysBefore(now, LAST_HYGIENE_LOOKBACK_DAYS)))]),
    group ? `${groupKeyOf(group)}:${today}` : null,
  );

  const children = group && day.data ? buildChildren(group, today, day.data[0].children, day.data[1], queue) : [];
  const { reload: reloadGroups } = groups;
  const { reload: reloadDay } = day;
  const reload = useCallback(() => {
    reloadGroups();
    reloadDay();
  }, [reloadGroups, reloadDay]);

  return {
    groups: groupList,
    group,
    hasNoGroup: groups.data !== null && groupList.length === 0,
    children,
    queue,
    loading: groups.loading || (group !== null && day.loading),
    failed: groups.failed || day.failed,
    reload,
  };
}

function buildChildren(
  group: ChildGroup,
  today: string,
  roster: Awaited<ReturnType<typeof fetchRoomRoster>>['children'],
  routines: GroupRoutine[],
  queue: RoutineQueueState,
): GroupDayChild[] {
  const todayRoutines = new Map(routines.filter((routine) => routine.routine_date === today).map((routine) => [routine.child_id, routine]));
  const latestHygiene = new Map<string, GroupRoutine>();
  for (const routine of routines) {
    if (routine.hygiene_entries?.length && !latestHygiene.has(routine.child_id)) latestHygiene.set(routine.child_id, routine);
  }

  return roster.map((child) => {
    const target = { childId: child.id, roomId: group.roomId, shiftId: group.shiftId, routineDate: today };
    const key = routineKey(target);
    const saved = queue.synced[key] ?? todayRoutines.get(child.id) ?? null;
    const queued = queue.items.find((item) => item.key === key);
    const status = childSyncStatus(queue.items, new Set(saved ? [child.id] : []), target);
    const firstName = child.first_name ?? child.display_name;
    return {
      id: child.id,
      name: child.display_name,
      firstName,
      photoPath: child.photo_path,
      allergies: child.allergies,
      target,
      status,
      draft:
        queued?.draft ??
        (saved ? draftFromRoutine(saved, group.shift) : defaultDraft(group.shift, lastHygieneKind(latestHygiene.get(child.id)?.hygiene_entries ?? []))),
      savedAt: saved?.updated_at ?? null,
    };
  });
}
