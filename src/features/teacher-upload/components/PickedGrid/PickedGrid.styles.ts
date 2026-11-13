import { StyleSheet } from 'react-native';

export const TILES_PER_ROW = 3;
const TILE_GAP = 6;

export const styles = StyleSheet.create({
  grid: { gap: TILE_GAP },
  row: { flexDirection: 'row', gap: TILE_GAP },
  spacer: { flex: 1 },
});
