import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_ROWS = 4;
export const SKELETON_ROW_HEIGHT = 48;
const SHEET_MAX_HEIGHT = '80%';

export const styles = StyleSheet.create({
  sheet: { maxHeight: SHEET_MAX_HEIGHT },
  content: { gap: space.s3, flexShrink: 1 },
  list: { flexGrow: 0 },
  skeleton: { gap: space.s2 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
