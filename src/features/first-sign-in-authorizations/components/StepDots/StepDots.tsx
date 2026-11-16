import { View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { FIRST_SIGN_IN_COPY } from '@/features/first-sign-in-authorizations/first-sign-in-copy';

import { dotFillTransition, styles, useDotColorStyles } from './StepDots.styles';

interface StepDotsProps {
  stepIndex: number;
  stepCount: number;
}

export function StepDots({ stepIndex, stepCount }: StepDotsProps) {
  const colorStyles = useDotColorStyles();
  const reduced = useReducedMotion();

  return (
    <View style={styles.dots} accessible accessibilityLabel={FIRST_SIGN_IN_COPY.stepOf(stepIndex + 1, stepCount)}>
      {Array.from({ length: stepCount }, (_, dotIndex) => (
        <Animated.View key={dotIndex} style={[styles.dot, dotIndex <= stepIndex ? colorStyles.filled : colorStyles.empty, !reduced && dotFillTransition]} />
      ))}
    </View>
  );
}
