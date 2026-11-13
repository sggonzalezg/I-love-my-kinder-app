import { router, useLocalSearchParams } from 'expo-router';
import { Fragment } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import type { SelectOption } from '@/components/Select/Select';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { childFileHref } from '@/constants/routes';
import type { TeacherGroup } from '@/data/teacher-day';
import { GroupControl } from '@/features/teacher-day/components/GroupControl/GroupControl';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { groupKeyOf } from '@/features/teacher-day/use-group-day';
import { MIN_GROUPS_TO_SWITCH } from '@/features/teacher-day/use-room-switch-options';
import { BirthdayRow } from '@/features/teacher-room/components/BirthdayRow/BirthdayRow';
import { BirthdayTodayCard } from '@/features/teacher-room/components/BirthdayTodayCard/BirthdayTodayCard';
import { NoBirthdaysCard } from '@/features/teacher-room/components/NoBirthdaysCard/NoBirthdaysCard';
import { RoomChildRow } from '@/features/teacher-room/components/RoomChildRow/RoomChildRow';
import { TEACHER_ROOM_COPY } from '@/features/teacher-room/teacher-room-copy';
import { useTeacherRoom } from '@/features/teacher-room/use-teacher-room';
import { initials } from '@/lib/format';
import { groupLabel } from '@/lib/shift';
import { childCountLabel, nextBirthdayLine, roomBirthdays, todayBirthdayLine } from '@/lib/teacher-room';
import { listEntering } from '@/theme/motion';

import { SKELETON_CARD_HEIGHT, SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useTeacherRoomStyles } from './TeacherRoomScreen.styles';

function roomSwitchOptions(groups: TeacherGroup[], childCounts: number[] | null): SelectOption[] | null {
  if (groups.length < MIN_GROUPS_TO_SWITCH) return null;
  return groups.map((group, index) => ({
    value: groupKeyOf(group),
    label: groupLabel(group.roomName, group.shift),
    description: childCounts ? childCountLabel(childCounts[index]) : undefined,
  }));
}

export function TeacherRoomScreen() {
  const reduced = useReducedMotion();
  const themed = useTeacherRoomStyles();
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

  const birthdays = roomBirthdays(
    children.map((child) => ({ id: child.id, name: child.display_name, firstName: child.first_name ?? child.display_name, birthDate: child.birth_date })),
    new Date(),
  );
  const hasCloseBirthday = birthdays.today.length + birthdays.upcoming.length > 0;

  return (
    <Screen header={header}>
      {birthdays.today.map((birthday) => (
        <BirthdayTodayCard key={birthday.id} firstName={birthday.firstName} detail={todayBirthdayLine(birthday.ageTurning, groupLabel(group.roomName, group.shift))} />
      ))}
      {hasCloseBirthday ? null : <NoBirthdaysCard nextLine={birthdays.next ? nextBirthdayLine(birthdays.next) : null} />}
      {birthdays.upcoming.length ? (
        <View style={styles.section}>
          <Text variant="section" accessibilityRole="header">
            {TEACHER_ROOM_COPY.upcomingBirthdays}
          </Text>
          <View style={[styles.list, themed.list]}>
            {birthdays.upcoming.map((birthday, index) => (
              <Fragment key={birthday.id}>
                {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
                <Animated.View entering={listEntering(index, reduced)}>
                  <BirthdayRow birthday={birthday} />
                </Animated.View>
              </Fragment>
            ))}
          </View>
        </View>
      ) : null}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="section" accessibilityRole="header">
            {TEACHER_ROOM_COPY.roomChildren}
          </Text>
          <Text variant="caption" tone="muted" numeric>
            {children.length}
          </Text>
        </View>
        <View style={[styles.list, themed.list]}>
          {children.map((child, index) => (
            <Fragment key={child.id}>
              {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
              <Animated.View entering={listEntering(index, reduced)}>
                <RoomChildRow
                  name={child.display_name}
                  initials={initials(child.first_name ?? child.display_name, child.last_name ?? '')}
                  photoPath={child.photo_path}
                  hasAllergy={!!child.allergies}
                  onPress={() => router.push(childFileHref(child.id))}
                />
              </Animated.View>
            </Fragment>
          ))}
        </View>
      </View>
    </Screen>
  );
}
