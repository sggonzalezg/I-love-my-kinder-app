import { router } from 'expo-router';
import { Fragment } from 'react';
import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { BirthdayRow } from '@/components/BirthdayRow/BirthdayRow';
import { BirthdayTodayCard } from '@/components/BirthdayTodayCard/BirthdayTodayCard';
import { GROUP_ROSTER_COPY } from '@/components/GroupRoster/group-roster-copy';
import { NoBirthdaysCard } from '@/components/NoBirthdaysCard/NoBirthdaysCard';
import { RoomChildRow } from '@/components/RoomChildRow/RoomChildRow';
import { Text } from '@/components/text';
import { childFileHref } from '@/constants/routes';
import type { RosterChild } from '@/data/family-room';
import { initials } from '@/lib/format';
import { nextBirthdayLine, roomBirthdays, todayBirthdayLine } from '@/lib/teacher-room';
import { listEntering } from '@/theme/motion';

import { styles, useGroupRosterStyles } from './GroupRoster.styles';

interface GroupRosterProps {
  rosterChildren: RosterChild[];
  groupLabel: string;
  childrenTitle: string;
}

/** The birthdays and children of one group, as T7 shows them; the director's group view reuses it. */
export function GroupRoster({ rosterChildren, groupLabel, childrenTitle }: GroupRosterProps) {
  const reduced = useReducedMotion();
  const themed = useGroupRosterStyles();

  const birthdays = roomBirthdays(
    rosterChildren.map((child) => ({ id: child.id, name: child.display_name, firstName: child.first_name, birthDate: child.birth_date })),
    new Date(),
  );
  const hasCloseBirthday = birthdays.today.length + birthdays.upcoming.length > 0;

  return (
    <>
      {birthdays.today.map((birthday) => (
        <BirthdayTodayCard key={birthday.id} firstName={birthday.firstName} detail={todayBirthdayLine(birthday.ageTurning, groupLabel)} />
      ))}
      {hasCloseBirthday ? null : <NoBirthdaysCard nextLine={birthdays.next ? nextBirthdayLine(birthdays.next) : null} />}
      {birthdays.upcoming.length ? (
        <View style={styles.section}>
          <Text variant="section" accessibilityRole="header">
            {GROUP_ROSTER_COPY.upcomingBirthdays}
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
            {childrenTitle}
          </Text>
          <Text variant="caption" tone="muted" numeric>
            {rosterChildren.length}
          </Text>
        </View>
        <View style={[styles.list, themed.list]}>
          {rosterChildren.map((child, index) => (
            <Fragment key={child.id}>
              {index > 0 ? <View style={[styles.separator, themed.separator]} /> : null}
              <Animated.View entering={listEntering(index, reduced)}>
                <RoomChildRow
                  name={child.display_name}
                  initials={initials(child.first_name, child.last_name)}
                  photoPath={child.photo_path}
                  hasAllergy={!!child.allergies}
                  onPress={() => router.push(childFileHref(child.id))}
                />
              </Animated.View>
            </Fragment>
          ))}
        </View>
      </View>
    </>
  );
}
