import { StyleSheet } from 'react-native';

import { fonts, radius, space, tabular } from '@/theme/tokens';

const DATE_TILE_SIZE = 52;
const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  dateTile: { width: DATE_TILE_SIZE, height: DATE_TILE_SIZE, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  day: { fontFamily: fonts.display800, fontSize: 18, lineHeight: 18, ...tabular },
  month: { fontFamily: fonts.text600, fontSize: 11, lineHeight: 11 },
  text: { flex: 1, minWidth: 0 },
});
