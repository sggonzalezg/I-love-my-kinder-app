import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import { darkColors, lightColors, type Colors } from './tokens';
import { useIsDark } from './use-theme';

type NamedStyles = Record<string, ViewStyle | TextStyle | ImageStyle>;
type StyleFactory<T> = (colors: Colors) => T;

export function buildSchemeStyles<T extends NamedStyles>(factory: StyleFactory<T>): { light: T; dark: T } {
  return { light: StyleSheet.create(factory(lightColors)), dark: StyleSheet.create(factory(darkColors)) };
}

/** Builds a component's color-dependent styles once per color scheme and returns the hook that picks the current one. */
export function createThemedStyles<T extends NamedStyles>(factory: StyleFactory<T>): () => T {
  const stylesByScheme = buildSchemeStyles(factory);
  return function useThemedStyles() {
    return useIsDark() ? stylesByScheme.dark : stylesByScheme.light;
  };
}
