import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_ROW_HEIGHT = 72;
export const SKELETON_ROWS = 3;

export const styles = StyleSheet.create({
  list: { gap: space.s2 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
