import { StyleSheet, type DimensionValue } from 'react-native';
import type { CSSAnimationProperties } from 'react-native-reanimated';

import { radius } from '@/theme/tokens';

export const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0.3 },
});

export const pulseAnimation: CSSAnimationProperties = {
  animationName: { from: { opacity: 0.15 }, to: { opacity: 0.6 } },
  animationDuration: '1200ms',
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
  animationTimingFunction: 'ease-in-out',
};

export function skeletonShapeStyle(width: DimensionValue, height: number, round?: boolean) {
  return { width, height, borderRadius: round ? radius.full : radius.sm };
}
