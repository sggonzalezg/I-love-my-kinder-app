import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type Colors, space, radius, type as typeTokens, size } from './tokens';

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? darkColors : lightColors;
}

export function useIsDark(): boolean {
  return useColorScheme() === 'dark';
}

// Helper for common spacing aliases
const spacingMap = {
  xs: space.s2,
  sm: space.s3,
  md: space.s4,
  lg: space.s6,
  xl: space.s8,
};

// Helper for common color aliases
function createColorAliases(c: Colors): Colors & {
  primary: string;
  secondary: string;
  onPrimary: string;
  onSecondary: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceVariant: string;
  error: string;
  onError: string;
} {
  return {
    ...c,
    primary: c.blue,
    secondary: c.blue50,
    onPrimary: c.onBlue,
    onSecondary: c.ink,
    onSurface: c.ink,
    onSurfaceVariant: c.muted,
    surfaceVariant: c.raised,
    error: c.red,
    onError: c.onRed,
  } as any;
}

export function useTheme() {
  const colors = createColorAliases(useColors());
  return {
    colors,
    spacing: { ...space, ...spacingMap },
    radius,
    type: typeTokens,
    size,
  };
}
