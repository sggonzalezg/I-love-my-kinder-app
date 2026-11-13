import { router, useLocalSearchParams } from 'expo-router';
import { Bell, Check, Clock } from 'lucide-react-native';
import { Fragment } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { EmptyState } from '@/components/empty-state';
import { IconButton } from '@/components/icon-button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { routineLogHref } from '@/constants/routine';
import { NOTICES_ROUTE } from '@/constants/routes';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { ChildStatusRow } from '@/features/teacher-day/components/ChildStatusRow/ChildStatusRow';
import { GroupControl } from '@/features/teacher-day/components/GroupControl/GroupControl';
import { RoomDaySeal } from '@/features/teacher-day/components/RoomDaySeal/RoomDaySeal';
import { TodayProgress } from '@/features/teacher-day/components/TodayProgress/TodayProgress';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { groupKeyOf, useGroupDay, type GroupDayChild } from '@/features/teacher-day/use-group-day';
import { useRoomSwitchOptions } from '@/features/teacher-day/use-room-switch-options';
import { formatTime } from '@/lib/dates';
import { pendingCount } from '@/lib/routine-queue';
import { dayHeaderDate, firstToLogIndex, logButtonLabel, readyCount } from '@/lib/teacher-day';
import { listEntering } from '@/theme/motion';
import { size } from '@/theme/tokens';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles, useTeacherTodayStyles } from './TeacherTodayScreen.styles';

function latestSave(children: GroupDayChild[]): string {
  const latest = children.reduce<string | null>((newest, child) => (child.savedAt && (!newest || child.savedAt > newest) ? child.savedAt : newest), null);
  return formatTime(latest ? new Date(latest) : new Date());
}

export function TeacherTodayScreen() {
  const reduced = useReducedMotion();
  const themed = useTeacherTodayStyles();
  const params = useLocalSearchParams<{ group?: string }>();
  const { groups, group, hasNoGroup, children, queue, loading, failed, reload } = useGroupDay(params.group ?? null);
  useReloadOnRefocus(reload);

  const statuses = children.map((child) => child.status);
  const ready = readyCount(statuses);
  const total = children.length;
  const roomOptions = useRoomSwitchOptions(groups, group, { childCount: total, readyCount: ready });
  const complete = total > 0 && ready === total;
  const unsent = group ? pendingCount(queue.items, group) : 0;
  const hasRejected = queue.items.some((item) => item.status === 'rejected');

  const openLog = (childIndex: number) => {
    if (!group) return;
    router.push(routineLogHref(groupKeyOf(group), childIndex));
  };

  const header = (
    <View style={styles.topBar}>
      <GroupControl group={group} options={roomOptions} />
      <IconButton icon={Bell} label={TEACHER_DAY_COPY.bell} onPress={() => router.push(NOTICES_ROUTE)} />
    </View>
  );

  if (hasNoGroup) {
    return (
      <Screen header={header}>
        <EmptyState title={TEACHER_DAY_COPY.noGroup} description={TEACHER_DAY_COPY.noGroupHint} />
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      {queue.offline ? <Banner kind="offline" text={TEACHER_DAY_COPY.offlineToday} /> : null}
      {hasRejected ? <Banner kind="error" text={TEACHER_DAY_COPY.notInGroup} /> : null}
      {failed ? (
        <View style={styles.error}>
          <Text tone="red">{TEACHER_DAY_COPY.loadError}</Text>
          <Button label={TEACHER_DAY_COPY.retry} variant="soft" onPress={reload} />
        </View>
      ) : null}
      {loading && !failed ? (
        <View style={styles.skeleton}>
          <Skeleton height={size.teacherAction} />
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      ) : null}
      {!loading && !failed && group ? (
        <>
          {complete ? <RoomDaySeal signedAt={latestSave(children)} /> : null}
          <View>
            <TodayProgress ready={ready} total={total} />
            <View style={styles.between}>
              {complete && unsent === 0 ? <Chip variant="ok" icon={Check} label={TEACHER_DAY_COPY.allSynced} /> : null}
              {unsent > 0 ? <Chip variant="wait" icon={Clock} label={TEACHER_DAY_COPY.unsent(unsent)} /> : null}
              {!complete && unsent === 0 && ready === 0 ? (
                <Text variant="small" tone="muted">
                  {TEACHER_DAY_COPY.toLog(total)}
                </Text>
              ) : null}
              <View style={styles.spacer} />
              {!complete ? <Text variant="caption" tone="muted">{dayHeaderDate(new Date())}</Text> : null}
            </View>
          </View>
          {complete ? (
            <Button label={TEACHER_DAY_COPY.reviewOrEdit} variant="soft" block onPress={() => openLog(0)} />
          ) : (
            <Button label={logButtonLabel(ready)} block height={size.teacherAction} onPress={() => openLog(firstToLogIndex(statuses))} />
          )}
          {!complete && total > 0 ? (
            <View style={[styles.list, themed.list]}>
              {children.map((child, index) => (
                <Fragment key={child.id}>
                  {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
                  <Animated.View entering={listEntering(index, reduced)}>
                    <ChildStatusRow name={child.name} photoPath={child.photoPath} hasAllergy={!!child.allergies} status={child.status} onPress={() => openLog(index)} />
                  </Animated.View>
                </Fragment>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
