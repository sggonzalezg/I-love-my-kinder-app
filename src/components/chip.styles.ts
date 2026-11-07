import { StyleSheet } from 'react-native';

import { fonts, radius, type ColorName } from '@/theme/tokens';

export type ChipVariant = 'blue' | 'ok' | 'wait' | 'red' | 'grey';

export const CHIP_PALETTES: Record<ChipVariant, { background: ColorName; foreground: ColorName }> = {
  blue: { background: 'blue50', foreground: 'blue' },
  ok: { background: 'ok50', foreground: 'ok' },
  wait: { background: 'wait50', foreground: 'wait' },
  red: { background: 'red50', foreground: 'red' },
  grey: { background: 'raised', foreground: 'muted' },
};

export const CHIP_ICON_SIZE = 18;

export const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: radius.full, alignSelf: 'flex-start' },
  label: { fontFamily: fonts.text600 },
});
