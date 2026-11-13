import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Sun, Sunset } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { IconButton } from '@/components/icon-button';
import { SegmentedControl } from '@/components/segmented-control';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { CHILD_DAY_STRIP_DAYS } from '@/constants/routine';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import { DayCompactHeader } from '@/features/child-day/components/DayCompactHeader/DayCompactHeader';
import { DayPhotoHeader } from '@/features/child-day/components/DayPhotoHeader/DayPhotoHeader';
import { DayStrip } from '@/features/child-day/components/DayStrip/DayStrip';
import { ShiftDay } from '@/features/child-day/components/ShiftDay/ShiftDay';
import { useChildDay } from '@/features/child-day/use-child-day';
import { dayStrip, emptyDayTitle, type DayGroup } from '@/lib/child-day';
import { formatLongDate, fromIsoDate } from '@/lib/dates';
import { initials } from '@/lib/format';
import { shiftLabel } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useIsDark } from '@/theme/use-theme';

import { SKELETON, shiftEntering, styles, topInsetStyle } from './ChildDayScreen.styles';

const EMPTY_DAY_ILLUSTRATION = require('@/assets/images/blocks-markus-spiske.jpg');

interface ChildDayScreenProps {
  childId: string;
  /** With one child, F6 is the Hoy tab itself: no back button, F2's actions in the header and its cards below the day. */
  home?: { actions: ReactNode; footer: ReactNode };
}

function singleRoomName(groups: DayGroup[]): string | null {
  const rooms = new Set(groups.map((group) => group.roomName));
  return rooms.size === 1 ? groups[0].roomName : null;
}

function DaySkeleton() {
  return (
    <View style={styles.content}>
      <Skeleton width={SKELETON.titleWidth} height={SKELETON.titleHeight} />
      {Array.from({ length: SKELETON.blocks }, (_, index) => (
        <Skeleton key={index} height={SKELETON.blockHeight} />
      ))}
    </View>
  );
}

export function ChildDayScreen({ childId, home }: ChildDayScreenProps) {
  const reduced = useReducedMotion();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  const backgroundStyles = useBackgroundColorStyles();
  const day = useChildDay(childId);

  const today = new Date();
  const selectedDay = fromIsoDate(day.isoDate);
  const child = day.base?.child ?? null;
  const firstName = child?.firstName ?? '';
  const childInitials = child ? initials(child.firstName, child.lastName) : '';
  const backButton = home ? null : <IconButton icon={ChevronLeft} label={CHILD_DAY_COPY.back} onPress={() => router.back()} />;
  const shiftSwitch =
    day.groups.length > 1 && day.shown ? (
      <SegmentedControl
        options={day.groups.map((group) => ({ label: shiftLabel(group.shift), value: group.key, icon: group.shift === 'morning' ? Sun : Sunset }))}
        value={day.shown.group.key}
        onChange={day.chooseGroup}
      />
    ) : null;
  const photoHeader = day.isToday && child !== null;

  const header = photoHeader ? (
    <DayPhotoHeader photoPath={child.photoPath} firstName={firstName} initials={childInitials} leading={backButton} center={shiftSwitch} trailing={home?.actions} />
  ) : (
    <View style={topInsetStyle(insets.top)}>
      <DayCompactHeader photoPath={child?.photoPath ?? null} initials={childInitials} firstName={firstName} leading={backButton} trailing={home?.actions} />
    </View>
  );

  function body() {
    if (day.notFound) {
      return (
        <View style={styles.message}>
          <Text tone="muted">{CHILD_DAY_COPY.notFound}</Text>
        </View>
      );
    }
    if (day.failed) {
      return (
        <View style={styles.message}>
          <Text tone="red">{CHILD_DAY_COPY.loadError}</Text>
          <Button label={CHILD_DAY_COPY.retry} variant="soft" onPress={day.reload} />
        </View>
      );
    }
    if (day.loading || !child) return <DaySkeleton />;
    if (!day.shown || (!day.isToday && !day.hasAnyRoutine)) {
      return (
        <View style={styles.empty}>
          <EmptyState title={emptyDayTitle(selectedDay)} description={CHILD_DAY_COPY.emptyDayLine} illustration={EMPTY_DAY_ILLUSTRATION} />
        </View>
      );
    }

    const roomName = singleRoomName(day.groups);
    return (
      <View style={styles.content}>
        {!photoHeader ? shiftSwitch : null}
        <View style={styles.titles}>
          <Text variant="title" accessibilityRole="header">
            {day.isToday ? CHILD_DAY_COPY.title(firstName) : formatLongDate(selectedDay)}
          </Text>
          {day.isToday ? (
            <Text variant="small" tone="muted" numeric>
              {[formatLongDate(selectedDay), roomName].filter(Boolean).join(' · ')}
            </Text>
          ) : null}
        </View>
        <Animated.View key={day.shown.group.key} entering={shiftEntering(day.enterFrom, reduced)}>
          <ShiftDay
            shown={day.shown}
            day={selectedDay}
            today={today}
            isToday={day.isToday}
            firstName={firstName}
            roomInBand={!day.isToday || roomName === null}
            beat={day.beat}
          />
        </Animated.View>
        {home?.footer}
      </View>
    );
  }

  return (
    <View style={[styles.root, backgroundStyles.ground]}>
      <StatusBar style={photoHeader || dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {header}
        <DayStrip days={dayStrip(today, CHILD_DAY_STRIP_DAYS)} selectedIsoDate={day.isoDate} onChoose={day.chooseDay} />
        {body()}
      </ScrollView>
    </View>
  );
}
