import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

export const SKELETON_ROW_HEIGHT = 88;
export const SKELETON_ROWS = 4;
const SEPARATOR_HEIGHT = 1;

export const styles = StyleSheet.create({
  tools: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  results: { gap: space.s2 },
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  separator: { height: SEPARATOR_HEIGHT },
  stack: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

export const useChildrenListStyles = createThemedStyles((colors) => ({
  list: { backgroundColor: colors.surface },
  separator: { backgroundColor: colors.raised },
}));
