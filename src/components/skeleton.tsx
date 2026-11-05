import { StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const pulse = { from: { opacity: 0.15 }, to: { opacity: 0.6 } };

export function Skeleton({ width = '100%', height, round }: { width?: DimensionValue; height: number; round?: boolean }) {
  const c = useColors();
  const reduced = useReducedMotion();
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, { width, height, backgroundColor: c.raised, borderRadius: round ? radius.full : radius.sm }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: c.surface, opacity: 0.3 },
          !reduced && {
            animationName: pulse,
            animationDuration: '1200ms',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({ base: { overflow: 'hidden' } });
