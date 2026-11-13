import { router } from 'expo-router';
import { View } from 'react-native';

import { Select, type SelectOption } from '@/components/Select/Select';
import type { TeacherGroup } from '@/data/teacher-day';
import { GroupPill } from '@/features/teacher-day/components/GroupPill/GroupPill';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { groupKeyOf } from '@/features/teacher-day/use-group-day';
import { groupLabel } from '@/lib/shift';

interface GroupControlProps {
  group: TeacherGroup | null;
  /** The room switch rows, or null for a teacher with a single group. */
  options: SelectOption[] | null;
}

/** The chosen group lives in the route's `group` param, so T2 and T7 keep no state for it. */
export function GroupControl({ group, options }: GroupControlProps) {
  if (!group) return <View />;
  if (!options) return <GroupPill label={groupLabel(group.roomName, group.shift)} />;
  return (
    <Select
      variant="roomSwitch"
      label={TEACHER_DAY_COPY.roomSwitch}
      options={options}
      value={groupKeyOf(group)}
      onChange={(groupKey) => router.setParams({ group: groupKey })}
    />
  );
}
