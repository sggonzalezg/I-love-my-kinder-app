import { StyleSheet } from 'react-native';

import { fonts, radius, screenMargin, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;

export const styles = StyleSheet.create({
  strip: { flexGrow: 0 },
  content: { gap: space.s2, paddingHorizontal: screenMargin, paddingTop: space.s4, paddingBottom: space.s1 },
  chip: { height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.text600 },
});
