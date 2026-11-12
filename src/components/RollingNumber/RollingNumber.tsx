import type { StyleProp, TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { Text } from '@/components/text';
import type { ColorName } from '@/theme/tokens';

import { NUMBER_ROLL } from './RollingNumber.styles';

interface RollingNumberProps {
  value: number;
  tone?: ColorName;
  style?: StyleProp<TextStyle>;
}

/** A new value rolls up into place (design section 7, the T4 counter); with reduced motion it just swaps. */
export function RollingNumber({ value, tone, style }: RollingNumberProps) {
  return (
    <Animated.View key={value} entering={NUMBER_ROLL}>
      <Text numeric tone={tone} style={style}>
        {value}
      </Text>
    </Animated.View>
  );
}
