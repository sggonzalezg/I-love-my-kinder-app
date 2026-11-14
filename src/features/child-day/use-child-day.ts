import { useCallback, useReducer } from 'react';

import { fetchChildDayBase, fetchDayRoutines, type ChildDayBase } from '@/data/child-day';
import { claimDayBeat } from '@/data/day-beat-store';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { dayGroups, initialGroupKey, routineTeacher, type DayGroup, type DayRoutine, type GroupTeacher } from '@/lib/child-day';
import { toIsoDate } from '@/lib/dates';

import { CHILD_DAY_ACTIONS, childDayReducer, initialChildDayState, type EnterSide } from './child-day-reducer';

export interface ShownGroup {
  group: DayGroup;
  routine: DayRoutine | null;
  teacher: GroupTeacher | null;
}

export interface ChildDayView {
  base: ChildDayBase | null;
  isoDate: string;
  isToday: boolean;
  groups: DayGroup[];
  shown: ShownGroup | null;
  hasAnyRoutine: boolean;
  enterFrom: EnterSide | null;
  beat: boolean;
  loading: boolean;
  failed: boolean;
  notFound: boolean;
  reload: () => void;
  chooseDay: (isoDate: string) => void;
  chooseGroup: (groupKey: string) => void;
}

export function useChildDay(childId: string): ChildDayView {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const todayIso = toIsoDate(new Date());
  const [state, dispatch] = useReducer(childDayReducer, todayIso, initialChildDayState);

  const base = useAsync(() => fetchChildDayBase(userId!, childId), userId ? `${userId}:${childId}` : null);
  const routines = useAsync(() => fetchDayRoutines(childId, state.isoDate), `${childId}:${state.isoDate}`);
  const { reload: reloadBase } = base;
  const { reload: reloadRoutines } = routines;
  const reload = useCallback(() => {
    reloadBase();
    reloadRoutines();
  }, [reloadBase, reloadRoutines]);
  useReloadOnRefocus(reload);

  const dayRoutines = routines.data ?? [];
  const groups = dayGroups(base.data?.openGroups ?? [], dayRoutines.map((entry) => entry.group));
  const shownKey = state.groupKey ?? initialGroupKey(groups, new Date());
  const shownGroup = groups.find((group) => group.key === shownKey) ?? null;
  const shownRoutine = shownGroup ? (dayRoutines.find((entry) => entry.group.key === shownGroup.key)?.routine ?? null) : null;
  const shown = shownGroup
    ? { group: shownGroup, routine: shownRoutine, teacher: routineTeacher(shownRoutine, base.data?.teachers[shownGroup.key] ?? []) }
    : null;

  const isToday = state.isoDate === todayIso;
  const sealOnOpen = isToday && state.groupKey === null && Boolean(shown?.routine);
  const beatClaim = useAsync(() => claimDayBeat(childId, todayIso), sealOnOpen ? `${childId}:${todayIso}` : null);

  return {
    base: base.data,
    isoDate: state.isoDate,
    isToday,
    groups,
    shown,
    hasAnyRoutine: dayRoutines.length > 0,
    enterFrom: state.enterFrom,
    beat: sealOnOpen && beatClaim.data === true,
    loading: base.loading || routines.loading || (sealOnOpen && beatClaim.loading),
    failed: base.failed || routines.failed,
    notFound: !base.loading && !base.failed && base.data === null,
    reload,
    chooseDay: (isoDate) => dispatch({ type: CHILD_DAY_ACTIONS.DAY_CHOSEN, isoDate }),
    chooseGroup: (groupKey) =>
      shownKey && dispatch({ type: CHILD_DAY_ACTIONS.GROUP_CHOSEN, groupKey, fromKey: shownKey, groupKeys: groups.map((group) => group.key) }),
  };
}
