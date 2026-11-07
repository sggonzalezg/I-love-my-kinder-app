import { StyleSheet } from 'react-native';

import { fonts, radius, size, tabular } from '@/theme/tokens';

export const ICON_BUTTON_ICON_SIZE = 24;
const BADGE_SIZE = 18;

export const styles = StyleSheet.create({
  base: { width: size.touch, height: size.touch, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 0, minWidth: BADGE_SIZE, height: BADGE_SIZE, paddingHorizontal: 5, borderRadius: BADGE_SIZE / 2, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.text700, fontSize: 11, lineHeight: BADGE_SIZE, ...tabular },
});
