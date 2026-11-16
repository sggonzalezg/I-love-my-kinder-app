import { StyleSheet } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const ANSWER_ICON_SIZE = 16;
const PILL_HEIGHT = 48;
const PILL_BORDER_WIDTH = 1.5;

export const fillTransition: CSSTransitionProperties = {
  transitionProperty: ['backgroundColor', 'borderColor'],
  transitionDuration: duration.fast,
  transitionTimingFunction: cssEaseOut,
};

export const styles = StyleSheet.create({
  option: { flex: 1 },
  pill: {
    minHeight: PILL_HEIGHT,
    borderRadius: radius.full,
    borderWidth: PILL_BORDER_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s1,
    paddingHorizontal: space.s3,
  },
});

export const useAnswerOptionColorStyles = createThemedStyles((colors) => ({
  idle: { backgroundColor: colors.surface, borderColor: colors.border },
  yesSelected: { backgroundColor: colors.blue, borderColor: colors.blue },
  noSelected: { backgroundColor: colors.ink, borderColor: colors.ink },
}));

export type SelectedFill = 'yesSelected' | 'noSelected';
