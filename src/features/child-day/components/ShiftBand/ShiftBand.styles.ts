import { StyleSheet } from 'react-native';

import { fonts, radius, space } from '@/theme/tokens';

export const SHIFT_ICON_SIZE = 22;
const ICON_CIRCLE_SIZE = 40;
const BAND_PADDING_HORIZONTAL = 14;

export const styles = StyleSheet.create({
  band: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: BAND_PADDING_HORIZONTAL, borderRadius: radius.lg },
  iconCircle: { width: ICON_CIRCLE_SIZE, height: ICON_CIRCLE_SIZE, borderRadius: ICON_CIRCLE_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
  title: { fontFamily: fonts.display800, fontSize: 18, lineHeight: 22 },
});
