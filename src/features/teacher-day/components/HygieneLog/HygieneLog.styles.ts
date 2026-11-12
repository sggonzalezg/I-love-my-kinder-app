import { StyleSheet } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 28;

export const styles = StyleSheet.create({
  gap: { marginTop: space.s2 },
  row: { flexDirection: 'row', gap: space.s2 },
  add: { flex: 1 },
  logged: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: space.s2 },
  chip: { height: CHIP_HEIGHT, paddingHorizontal: 10, borderRadius: radius.full, justifyContent: 'center' },
  chipLabel: { fontFamily: fonts.text600, fontSize: 13, lineHeight: 16 },
});
