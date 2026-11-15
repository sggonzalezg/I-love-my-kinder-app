import { router } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import { Fragment } from 'react';
import { Pressable, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { GroupRoster } from '@/components/GroupRoster/GroupRoster';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { chatListFilteredHref } from '@/constants/chat';
import { GroupTeacherRow } from '@/features/director-rooms/components/GroupTeacherRow/GroupTeacherRow';
import { GroupTeachersSheet } from '@/features/director-rooms/components/GroupTeachersSheet/GroupTeachersSheet';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { useDirectorGroup } from '@/features/director-rooms/use-director-group';
import { useGroupTeachersSheet } from '@/features/director-rooms/use-group-teachers-sheet';
import { NO_TEACHER_FILTER_KEY } from '@/lib/chat-filters';
import { noTeacherRosterLine } from '@/lib/director-rooms';
import { groupLabel } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { SKELETON_ROW_HEIGHT, SKELETON_ROWS, styles } from './DirectorGroupScreen.styles';

interface DirectorGroupScreenProps {
  roomId: string;
  shiftId: string;
}

export function DirectorGroupScreen({ roomId, shiftId }: DirectorGroupScreenProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const { data: group, loading, failed, reload } = useDirectorGroup(roomId, shiftId);
  const teachersSheet = useGroupTeachersSheet(reload);
  const label = group ? groupLabel(group.roomName, group.shift) : undefined;
  const header = <TopBar title={label} backLabel={DIRECTOR_ROOMS_COPY.back} />;

  if (failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text tone="red">{DIRECTOR_ROOMS_COPY.groupLoadError}</Text>
          <Button label={DIRECTOR_ROOMS_COPY.retry} variant="soft" onPress={reload} />
        </View>
      </Screen>
    );
  }

  if (loading || !group || !label) {
    return (
      <Screen header={header}>
        <View style={styles.stack}>
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      </Screen>
    );
  }

  const { teachers, children } = group.roster;
  const openTeachersSheet = () => teachersSheet.open({ roomId, shiftId, label });

  return (
    <Screen header={header}>
      {teachers.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="section" accessibilityRole="header">
              {DIRECTOR_ROOMS_COPY.teachers}
            </Text>
            <Pressable
              onPress={openTeachersSheet}
              accessibilityRole="button"
              accessibilityHint={DIRECTOR_ROOMS_COPY.teachersSheetTitle(label)}
              style={styles.sectionLink}>
              <Text variant="smallStrong" tone="blue">
                {DIRECTOR_ROOMS_COPY.changeTeachers}
              </Text>
            </Pressable>
          </View>
          <View style={[styles.list, backgroundStyles.surface]}>
            {teachers.map((teacher, index) => (
              <Fragment key={teacher.id}>
                {index > 0 ? <View style={[styles.separator, backgroundStyles.raised]} /> : null}
                <GroupTeacherRow teacher={teacher} />
              </Fragment>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.noTeacher}>
          <Banner kind="error" text={noTeacherRosterLine(children.length)} />
          <Button label={DIRECTOR_ROOMS_COPY.assignTeacherLong} block onPress={openTeachersSheet} />
          <Button
            label={DIRECTOR_ROOMS_COPY.seeConversations}
            icon={MessageSquare}
            variant="soft"
            block
            onPress={() => router.push(chatListFilteredHref(NO_TEACHER_FILTER_KEY))}
          />
        </View>
      )}
      <GroupRoster rosterChildren={children} groupLabel={label} childrenTitle={DIRECTOR_ROOMS_COPY.children} />
      <GroupTeachersSheet control={teachersSheet} />
    </Screen>
  );
}
