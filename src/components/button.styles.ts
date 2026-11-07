import { StyleSheet } from 'react-native';

import { TRANSPARENT, type BackgroundName } from '@/theme/color-styles';
import { radius, space } from '@/theme/tokens';

export type ButtonPaletteVariant = 'primary' | 'soft' | 'plain' | 'danger' | 'danger-soft' | 'ghost';

type ButtonPalette = { idle: BackgroundName; pressed: BackgroundName; label: Exclude<BackgroundName, typeof TRANSPARENT> };

export const BUTTON_PALETTES: Record<ButtonPaletteVariant, ButtonPalette> = {
  primary: { idle: 'blue', pressed: 'bluePress', label: 'onBlue' },
  soft: { idle: 'blue50', pressed: 'blue100', label: 'blue' },
  plain: { idle: 'surface', pressed: 'raised', label: 'ink' },
  danger: { idle: 'red', pressed: 'red', label: 'onRed' },
  'danger-soft': { idle: 'red50', pressed: 'red50', label: 'red' },
  ghost: { idle: TRANSPARENT, pressed: 'raised', label: 'blue' },
};

export const BUTTON_ICON_SIZE = 20;
const BUTTON_PADDING_HORIZONTAL = 22;

export const styles = StyleSheet.create({
  base: { borderRadius: radius.full, paddingHorizontal: BUTTON_PADDING_HORIZONTAL, justifyContent: 'center', alignItems: 'center' },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
});

export function buttonHeightStyle(height: number) {
  return { minHeight: height };
}
