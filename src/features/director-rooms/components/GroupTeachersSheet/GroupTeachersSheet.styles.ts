import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const SKELETON_ROWS = 3;
export const SKELETON_ROW_HEIGHT = 56;
const SHEET_MAX_HEIGHT = '85%';

export const styles = StyleSheet.create({
  sheet: { maxHeight: SHEET_MAX_HEIGHT },
  content: { gap: space.s3, flexShrink: 1 },
  list: { flexGrow: 0, borderRadius: radius.lg, overflow: 'hidden' },
  skeleton: { gap: space.s2 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  actions: { gap: space.s2, marginTop: space.s2 },
});
