import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

const PHOTO_HEIGHT = 232;
const OVERLAY_SIDE = 16;
const INITIALS_SIZE = 64;

export const styles = StyleSheet.create({
  header: { height: PHOTO_HEIGHT, overflow: 'hidden' },
  photo: { ...StyleSheet.absoluteFill },
  initialsPlate: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fonts.display900, fontSize: INITIALS_SIZE, lineHeight: INITIALS_SIZE + space.s2 },
  overlay: { position: 'absolute', left: OVERLAY_SIDE, right: OVERLAY_SIDE, flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  center: { flex: 1 },
});

export function overlayTopStyle(topInset: number) {
  return { top: topInset + space.s2 };
}
