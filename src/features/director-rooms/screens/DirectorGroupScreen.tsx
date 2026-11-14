import { Fragment } from 'react';
import { View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { GroupRoster } from '@/components/GroupRoster/GroupRoster';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { GroupTeacherRow } from '@/features/director-rooms/components/GroupTeacherRow/GroupTeacherRow';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { useDirectorGroup } from '@/features/director-rooms/use-director-group';
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

  return (
    <Screen header={header}>
      {teachers.length ? (
        <View style={styles.section}>
          <Text variant="section" accessibilityRole="header">
            {DIRECTOR_ROOMS_COPY.teachers}
          </Text>
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
        <Banner kind="error" text={noTeacherRosterLine(children.length)} />
      )}
      <GroupRoster rosterChildren={children} groupLabel={label} childrenTitle={DIRECTOR_ROOMS_COPY.children} />
    </Screen>
  );
}
