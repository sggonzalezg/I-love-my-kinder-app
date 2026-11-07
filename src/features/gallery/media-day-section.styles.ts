import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const TILE_GAP = 3;

export const styles = StyleSheet.create({
  section: { gap: space.s3 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  grid: { gap: TILE_GAP, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', gap: TILE_GAP },
  filler: { flex: 1 },
});
