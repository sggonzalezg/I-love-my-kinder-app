import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_TILE_HEIGHT = 140;
export const SKELETON_TILE_ROWS = 3;

export const styles = StyleSheet.create({
  sections: { gap: space.s6 },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
  footer: { textAlign: 'center', marginHorizontal: space.s2, marginBottom: space.s5 },
  empty: { paddingTop: space.s12 + space.s4 },
});
