import { Heart } from 'lucide-react-native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { dayBeat } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { HEART_SIZE, SEAL_TEXT_ENTERING, styles } from './ShiftSeal.styles';

interface ShiftSealProps {
  title: string;
  line: string;
  beat: boolean;
}

export function ShiftSeal({ title, line, beat }: ShiftSealProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.seal, backgroundStyles.red50]} accessible>
      <View style={[styles.heartWell, backgroundStyles.surface]}>
        <Animated.View entering={beat ? dayBeat : undefined}>
          <Heart size={HEART_SIZE} color={colors.heart} fill={colors.heart} />
        </Animated.View>
      </View>
      <Animated.View entering={beat ? SEAL_TEXT_ENTERING : undefined} style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text variant="small" numeric>
          {line}
        </Text>
      </Animated.View>
    </View>
  );
}
