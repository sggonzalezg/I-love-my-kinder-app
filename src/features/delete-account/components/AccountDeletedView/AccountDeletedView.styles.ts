import { StyleSheet } from 'react-native';

import { radius, screenMargin, space } from '@/theme/tokens';

export const SUCCESS_ICON_SIZE = 88;
export const CHECK_GLYPH_SIZE = 40;
const TOP_SPACE = 120;

export const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: TOP_SPACE, paddingHorizontal: screenMargin, alignItems: 'center' },
  successIcon: {
    width: SUCCESS_ICON_SIZE,
    height: SUCCESS_ICON_SIZE,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.s5,
  },
  centered: { textAlign: 'center' },
  line: { textAlign: 'center', marginTop: space.s2 },
  action: { marginTop: space.s6, alignSelf: 'stretch' },
});
