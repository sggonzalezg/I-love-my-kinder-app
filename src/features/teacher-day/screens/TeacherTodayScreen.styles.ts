import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, screenMargin, space } from '@/theme/tokens';

export const SKELETON_ROWS = 5;
export const SKELETON_ROW_HEIGHT = 64;
const TOP_BAR_MIN_HEIGHT = 56;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.s3,
    paddingTop: space.s2,
    paddingBottom: space.s3,
    paddingHorizontal: screenMargin,
    minHeight: TOP_BAR_MIN_HEIGHT,
  },
  between: { flexDirection: 'row', alignItems: 'center', gap: space.s3, marginTop: space.s2 },
  spacer: { flex: 1 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useTeacherTodayStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
