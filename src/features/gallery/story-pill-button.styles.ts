import { StyleSheet } from 'react-native';

import { lightColors, radius, size, space } from '@/theme/tokens';

export const PILL_ICON_SIZE = 18;
const PILL_HEIGHT = size.touch;

// Over the always-black viewer the pill keeps the light palette in dark mode too (design F7b "white pill").
export const PILL_FOREGROUND = lightColors.ink;

export const styles = StyleSheet.create({
  pill: {
    minHeight: PILL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    paddingHorizontal: space.s4,
    borderRadius: radius.full,
    backgroundColor: lightColors.white,
  },
  pressed: { backgroundColor: lightColors.raised },
  label: { color: PILL_FOREGROUND },
});
