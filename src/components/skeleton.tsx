import { View, type DimensionValue } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useBackgroundColorStyles } from '@/theme/color-styles';

import { pulseAnimation, skeletonShapeStyle, styles } from './skeleton.styles';

export function Skeleton({ width = '100%', height, round }: { width?: DimensionValue; height: number; round?: boolean }) {
  const backgroundStyles = useBackgroundColorStyles();
  const reduced = useReducedMotion();
  return (
    <View importantForAccessibility="no-hide-descendants" style={[styles.base, skeletonShapeStyle(width, height, round), backgroundStyles.raised]}>
      <Animated.View style={[styles.overlay, backgroundStyles.surface, !reduced && pulseAnimation]} />
    </View>
  );
}
