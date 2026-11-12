import type { SelectOption } from '@/components/Select/Select';
import { fetchRoomRoster } from '@/data/family-room';
import { fetchSavedRoutineCount, type TeacherGroup } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { toIsoDate } from '@/lib/dates';
import { groupLabel } from '@/lib/shift';
import { roomSwitchMeta } from '@/lib/teacher-day';

import { groupKeyOf } from './use-group-day';

const MIN_GROUPS_TO_SWITCH = 2;

interface ShownGroupCounts {
  childCount: number;
  readyCount: number;
}

async function fetchGroupCounts(group: TeacherGroup, today: string): Promise<ShownGroupCounts> {
  const [roster, readyCount] = await Promise.all([fetchRoomRoster(group), fetchSavedRoutineCount(group, today)]);
  return { childCount: roster.children.length, readyCount };
}

/** The room switch rows, or null when the teacher has a single group; the shown group uses its live counts, which include unsent days. */
export function useRoomSwitchOptions(groups: TeacherGroup[], shownGroup: TeacherGroup | null, shownCounts: ShownGroupCounts): SelectOption[] | null {
  const now = new Date();
  const today = toIsoDate(now);
  const canSwitch = groups.length >= MIN_GROUPS_TO_SWITCH;
  const counts = useAsync(
    () => Promise.all(groups.map((group) => fetchGroupCounts(group, today))),
    canSwitch ? `${groups.map(groupKeyOf).join(',')}:${today}` : null,
  );
  if (!canSwitch) return null;

  return groups.map((group, index) => {
    const value = groupKeyOf(group);
    const groupCounts = shownGroup && value === groupKeyOf(shownGroup) ? shownCounts : counts.data?.[index];
    return {
      value,
      label: groupLabel(group.roomName, group.shift),
      description: groupCounts ? roomSwitchMeta({ ...groupCounts, shiftStartTime: group.shiftStartTime }, now) : undefined,
    };
  });
}
