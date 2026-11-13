import { StyleSheet } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';

const DATE_TILE_SIZE = 52;
const DATE_TILE_DAY_SIZE = 18;
const DATE_TILE_MONTH_SIZE = 11;
const TEXT_GAP = 2;
export const NEXT_EVENT_PRESSED_SCALE = 0.98;
export const CHEVRON_SIZE = 20;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, borderRadius: radius.lg, padding: space.s3 },
  dateTile: { width: DATE_TILE_SIZE, height: DATE_TILE_SIZE, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  dateTileDay: { fontFamily: fonts.display800, fontSize: DATE_TILE_DAY_SIZE, lineHeight: DATE_TILE_DAY_SIZE },
  dateTileMonth: { fontFamily: fonts.text600, fontSize: DATE_TILE_MONTH_SIZE, lineHeight: DATE_TILE_MONTH_SIZE + TEXT_GAP },
  text: { flex: 1, minWidth: 0, gap: TEXT_GAP },
});
