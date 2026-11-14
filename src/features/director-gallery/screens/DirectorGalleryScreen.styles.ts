import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_TILE_HEIGHT = 140;
export const SKELETON_TILE_ROWS = 3;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  sections: { gap: space.s6, paddingBottom: space.s5 },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  empty: { paddingTop: space.s10 },
});
