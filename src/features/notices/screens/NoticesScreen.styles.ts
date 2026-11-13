import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, size, space } from '@/theme/tokens';

export const CALENDAR_BUTTON_HEIGHT = size.touch;
export const EMPTY_ILLUSTRATION = require('@/assets/images/alphabet-puzzle-nhn.jpg');
export const SKELETON_ROW_HEIGHT = 88;
export const SKELETON_ROWS = 4;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useNoticesScreenStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
