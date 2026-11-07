import type { TextStyle, ViewStyle } from 'react-native';

import { createThemedStyles } from './themed-styles';
import type { ColorName, Colors } from './tokens';

export const TRANSPARENT = 'transparent';
export type BackgroundName = ColorName | typeof TRANSPARENT;

export function styleEachColor<S>(colors: Colors, toStyle: (color: string) => S): Record<ColorName, S> {
  const colorNames = Object.keys(colors) as ColorName[];
  return Object.fromEntries(colorNames.map((name) => [name, toStyle(colors[name])])) as Record<ColorName, S>;
}

export const useTextColorStyles = createThemedStyles((colors) => styleEachColor<TextStyle>(colors, (color) => ({ color })));

export const useBackgroundColorStyles = createThemedStyles((colors) => ({
  ...styleEachColor<ViewStyle>(colors, (color) => ({ backgroundColor: color })),
  [TRANSPARENT]: { backgroundColor: TRANSPARENT },
}));
