import { CircleAlert } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import { DIRECTOR_ROOMS_COPY } from '@/features/director-rooms/director-rooms-copy';
import { groupMetaLine, hasNoTeacher, type DirectorGroup } from '@/lib/director-rooms';
import { shiftLabel } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './GroupRow.styles';

interface GroupRowProps {
  group: DirectorGroup;
  onPress: () => void;
}

export function GroupRow({ group, onPress }: GroupRowProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const meta = groupMetaLine(group);
  const isWithoutTeacher = hasNoTeacher(group);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={DIRECTOR_ROOMS_COPY.groupRowLabel(group.label, meta, isWithoutTeacher)}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.transparent]}>
      <Text variant="bodyStrong">{shiftLabel(group.shift)}</Text>
      <Text variant="small" tone="muted" numeric>
        {meta}
      </Text>
      {isWithoutTeacher ? (
        <View style={styles.chip}>
          <Chip label={DIRECTOR_ROOMS_COPY.noTeacher} icon={CircleAlert} variant="red" />
        </View>
      ) : null}
    </Pressable>
  );
}
