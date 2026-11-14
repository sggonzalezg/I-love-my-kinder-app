import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { Banner } from '@/components/banner';
import { BirthdayTodayCard } from '@/components/BirthdayTodayCard/BirthdayTodayCard';
import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { roomGroupHref } from '@/constants/routes';
import { GroupTeachersSheet } from '@/features/director-rooms/components/GroupTeachersSheet/GroupTeachersSheet';
import { RoomCard } from '@/features/director-rooms/components/RoomCard/RoomCard';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { useDirectorRooms } from '@/features/director-rooms/use-director-rooms';
import { useGroupTeachersSheet } from '@/features/director-rooms/use-group-teachers-sheet';
import { noTeacherGroupLine } from '@/lib/director-rooms';
import { listEntering } from '@/theme/motion';

import { SKELETON_CARD_HEIGHT, SKELETON_CARDS, styles } from './DirectorRoomsScreen.styles';

export function DirectorRoomsScreen() {
  const reduced = useReducedMotion();
  const { cards, groupsWithoutTeacher, birthdays, loading, failed, reload } = useDirectorRooms();
  const teachersSheet = useGroupTeachersSheet(reload);
  const header = <TopBar title={DIRECTOR_ROOMS_COPY.title} />;

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_ROOMS_COPY.loadError}</Text>
          <Button label={DIRECTOR_ROOMS_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen header={header}>
        <View style={styles.stack}>
          {Array.from({ length: SKELETON_CARDS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_CARD_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  if (!cards.length) {
    return (
      <Screen header={header}>
        <EmptyState title={DIRECTOR_ROOMS_COPY.emptyTitle} description={DIRECTOR_ROOMS_COPY.emptyHint} />
      </Screen>
    );
  }

  return (
    <Screen header={header}>
      <View style={styles.stack}>
        {birthdays.map((birthday) => (
          <BirthdayTodayCard key={birthday.childId} firstName={birthday.firstName} detail={birthday.detail} />
        ))}
        {groupsWithoutTeacher.map((group) => (
          <Pressable key={group.label} accessibilityRole="button" onPress={() => router.push(roomGroupHref(group.roomId, group.shiftId))}>
            <Banner kind="error" text={noTeacherGroupLine(group.label)} />
          </Pressable>
        ))}
        {cards.map((card, index) => (
          <Animated.View key={card.id} entering={listEntering(index, reduced)}>
            <RoomCard card={card} onManageTeachers={teachersSheet.open} />
          </Animated.View>
        ))}
      </View>
      <GroupTeachersSheet control={teachersSheet} />
    </Screen>
  );
}
