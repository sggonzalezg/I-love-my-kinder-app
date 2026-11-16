import { StyleSheet } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { createThemedStyles } from '@/theme/themed-styles';

const DOT_HEIGHT = 6;
const DOT_GAP = 6;

export const dotFillTransition: CSSTransitionProperties = {
  transitionProperty: 'backgroundColor',
  transitionDuration: duration.base,
  transitionTimingFunction: cssEaseOut,
};

export const styles = StyleSheet.create({
  dots: { flex: 1, flexDirection: 'row', gap: DOT_GAP },
  dot: { flex: 1, height: DOT_HEIGHT, borderRadius: DOT_HEIGHT / 2 },
});

export const useDotColorStyles = createThemedStyles((colors) => ({
  filled: { backgroundColor: colors.blue },
  empty: { backgroundColor: colors.raised },
}));
