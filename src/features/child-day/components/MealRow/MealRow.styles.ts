import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

const DOT_SIZE = 9;
const DOT_GAP = 3;

export const styles = StyleSheet.create({
  meter: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  dots: { flexDirection: 'row', gap: DOT_GAP },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
  amount: { fontFamily: fonts.text700 },
  updated: { fontFamily: fonts.text600, fontSize: 13, lineHeight: 17 },
});
