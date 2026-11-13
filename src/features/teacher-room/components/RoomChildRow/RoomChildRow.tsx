import { ChevronRight, CircleAlert } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { TEACHER_ROOM_COPY } from '@/features/teacher-room/teacher-room-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ICON_SIZE, styles } from './RoomChildRow.styles';

interface RoomChildRowProps {
  name: string;
  initials: string;
  photoPath: string | null;
  hasAllergy: boolean;
  onPress: () => void;
}

export function RoomChildRow({ name, initials, photoPath, hasAllergy, onPress }: RoomChildRowProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={TEACHER_ROOM_COPY.childRowLabel(name, hasAllergy)}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <Avatar photoPath={photoPath} initials={initials} />
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        {hasAllergy ? (
          <View style={styles.allergy}>
            <CircleAlert size={ICON_SIZE} color={colors.red} strokeWidth={1.8} />
            <Text variant="small" tone="red">
              {TEACHER_DAY_COPY.allergy}
            </Text>
          </View>
        ) : (
          <Text variant="small" tone="muted">
            {TEACHER_ROOM_COPY.seeFile}
          </Text>
        )}
      </View>
      <ChevronRight size={ICON_SIZE} color={colors.muted} strokeWidth={1.8} />
    </Pressable>
  );
}
