import { StyleSheet } from 'react-native';

import { fonts, radius } from '@/theme/tokens';

const INITIALS_FONT_RATIO = 0.36;

export const styles = StyleSheet.create({
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.text700 },
});

export function avatarFrameStyle(side: number) {
  return { width: side, height: side, borderRadius: radius.full };
}

export function initialsFontStyle(side: number) {
  return { fontSize: side * INITIALS_FONT_RATIO };
}
