import { StyleSheet } from 'react-native';

import { googleButtonColors, radius, space } from '@/theme/tokens';

export const PROVIDER_BUTTON_HEIGHT = 52;
export const GOOGLE_LOGO_SIZE = 20;
const GOOGLE_LABEL_SIZE = 16;
const GOOGLE_LINE_WIDTH = 1;
const GOOGLE_LOGO_GAP = 10;
const DISABLED_OPACITY = 0.4;

function googleSchemeStyles(colors: (typeof googleButtonColors)['light' | 'dark']) {
  return StyleSheet.create({
    button: { backgroundColor: colors.background, borderColor: colors.line },
    label: { color: colors.ink },
  });
}

export const googleSchemes = { light: googleSchemeStyles(googleButtonColors.light), dark: googleSchemeStyles(googleButtonColors.dark) };

export const styles = StyleSheet.create({
  container: { alignSelf: 'stretch' },
  disabled: { opacity: DISABLED_OPACITY },
  button: {
    minHeight: PROVIDER_BUTTON_HEIGHT,
    borderRadius: radius.full,
    borderWidth: GOOGLE_LINE_WIDTH,
    paddingHorizontal: space.s5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GOOGLE_LOGO_GAP,
  },
  // Google's branding asks for Roboto Medium, the Android system font; iOS uses its system font at the same weight.
  label: { fontSize: GOOGLE_LABEL_SIZE, fontWeight: '500' },
});
