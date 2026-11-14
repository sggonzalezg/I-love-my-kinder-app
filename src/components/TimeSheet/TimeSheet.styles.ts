import { StyleSheet } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;

export const styles = StyleSheet.create({
  body: { gap: space.s2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2, paddingTop: space.s4, paddingBottom: space.s1 },
  chip: { height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full, justifyContent: 'center' },
  wheel: { flexDirection: 'row', alignItems: 'center', gap: space.s2, marginTop: space.s3 },
  column: { flex: 1, gap: 6 },
  cell: { fontFamily: fonts.display800, fontSize: 20, lineHeight: 24, textAlign: 'center' },
  currentCell: { fontSize: 28, lineHeight: 34, paddingVertical: 10, borderRadius: radius.md, overflow: 'hidden' },
  colon: { fontFamily: fonts.display800, fontSize: 28, lineHeight: 28 },
  confirm: { marginTop: space.s5 },
});
