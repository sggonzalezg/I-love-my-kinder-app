import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { GROUP_ROSTER_COPY } from '@/components/GroupRoster/group-roster-copy';
import { GroupRoster } from '@/components/GroupRoster/GroupRoster';
import { Screen } from '@/components/screen';
import type { SelectOption } from '@/components/Select/Select';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import type { TeacherGroup } from '@/data/teacher-day';
import { GroupControl } from '@/features/teacher-day/components/GroupControl/GroupControl';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { groupKeyOf } from '@/features/teacher-day/use-group-day';
import { MIN_GROUPS_TO_SWITCH } from '@/features/teacher-day/use-room-switch-options';
import { useTeacherRoom } from '@/features/teacher-room/use-teacher-room';
import { groupLabel } from '@/lib/shift';
import { childCountLabel } from '@/lib/teacher-room';

import { SKELETON_CARD_HEIGHT, SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles } from './TeacherRoomScreen.styles';

function roomSwitchOptions(groups: TeacherGroup[], childCounts: number[] | null): SelectOption[] | null {
  if (groups.length < MIN_GROUPS_TO_SWITCH) return null;
  return groups.map((group, index) => ({
    value: groupKeyOf(group),
    label: groupLabel(group.roomName, group.shift),
    description: childCounts ? childCountLabel(childCounts[index]) : undefined,
  }));
}

export function TeacherRoomScreen() {
  const params = useLocalSearchParams<{ group?: string }>();
  const { groups, group, hasNoGroup, children, childCounts, loading, failed, reload } = useTeacherRoom(params.group ?? null);

  const header = (
    <View style={styles.topBar}>
      <GroupControl group={group} options={roomSwitchOptions(groups, childCounts)} />
    </View>
  );

  if (hasNoGroup) {
    return (
      <Screen header={header}>
        <EmptyState title={TEACHER_DAY_COPY.noGroup} description={TEACHER_DAY_COPY.noGroupHint} />
      </Screen>
    );
  }

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{TEACHER_DAY_COPY.loadError}</Text>
          <Button label={TEACHER_DAY_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading || !group) {
    return (
      <Screen header={header}>
        <View style={styles.skeleton}>
          <Skeleton height={SKELETON_CARD_HEIGHT} />
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      <GroupRoster rosterChildren={children} groupLabel={groupLabel(group.roomName, group.shift)} childrenTitle={GROUP_ROSTER_COPY.roomChildren} />
    </Screen>
  );
}
