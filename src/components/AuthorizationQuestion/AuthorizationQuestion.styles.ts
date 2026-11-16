import { StyleSheet } from 'react-native';
import type { CSSTransitionProperties } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { createThemedStyles } from '@/theme/themed-styles';
import { fonts, radius, size, space } from '@/theme/tokens';

export const QUESTION_ICON_SIZE = 20;
const ICON_CIRCLE_SIZE = 40;
const RING_WIDTH = 2;
const TITLE_FONT_SIZE = 17;
const TITLE_LINE_HEIGHT = 21;
const BLOCK_GAP = 10;
const HEAD_TEXT_GAP = 2;

export const ringTransition: CSSTransitionProperties = {
  transitionProperty: 'borderColor',
  transitionDuration: duration.base,
  transitionTimingFunction: cssEaseOut,
};

export const styles = StyleSheet.create({
  block: { borderRadius: radius.lg, borderWidth: RING_WIDTH, padding: space.s4 - RING_WIDTH, gap: BLOCK_GAP },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3 },
  iconCircle: { width: ICON_CIRCLE_SIZE, height: ICON_CIRCLE_SIZE, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  headText: { flex: 1, gap: HEAD_TEXT_GAP },
  title: { fontFamily: fonts.display800, fontSize: TITLE_FONT_SIZE, lineHeight: TITLE_LINE_HEIGHT },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.s2 },
  readLink: { minHeight: size.touch, justifyContent: 'center' },
});

export const useQuestionColorStyles = createThemedStyles((colors) => ({
  block: { backgroundColor: colors.surface },
  ringUnanswered: { borderColor: colors.wait50 },
  ringAnswered: { borderColor: colors.surface },
  iconCircle: { backgroundColor: colors.blue50 },
}));
