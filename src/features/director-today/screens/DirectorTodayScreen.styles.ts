import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const SKELETON_ROWS = 5;
export const SKELETON_ROW_HEIGHT = 64;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  list: { borderRadius: radius.lg, overflow: 'hidden', marginTop: space.s2 },
  separator: { height: SEPARATOR_HEIGHT },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useDirectorTodayStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
