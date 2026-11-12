import { Heart } from 'lucide-react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Text } from '@/components/text';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { dayBeat } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { HEART_SIZE, SEAL_TEXT_ENTERING, styles } from './RoomDaySeal.styles';

export function RoomDaySeal({ signedAt }: { signedAt: string }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.seal, backgroundStyles.red50]}>
      <View style={[styles.heartWell, backgroundStyles.surface]}>
        <Animated.View entering={dayBeat}>
          <Heart size={HEART_SIZE} color={colors.heart} fill={colors.heart} />
        </Animated.View>
      </View>
      <Animated.View entering={SEAL_TEXT_ENTERING} style={styles.text}>
        <Text style={styles.title}>{TEACHER_DAY_COPY.sealTitle}</Text>
        <Text variant="small" tone="muted" numeric>
          {TEACHER_DAY_COPY.sealLine(signedAt)}
        </Text>
      </Animated.View>
    </View>
  );
}
