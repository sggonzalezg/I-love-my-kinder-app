import { StyleSheet } from 'react-native';

import { fonts } from '@/theme/tokens';

const KID_PHOTO_SIZE = 84;
const KID_PHOTO_RADIUS = 20;
const INITIALS_FONT_SIZE = 28;
const SMALL_PHOTO_SIZE = 44;
const SMALL_PHOTO_RADIUS = 14;
const SMALL_INITIALS_FONT_SIZE = 16;

export const styles = StyleSheet.create({
  photo: { width: KID_PHOTO_SIZE, height: KID_PHOTO_SIZE, borderRadius: KID_PHOTO_RADIUS },
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.display800, fontSize: INITIALS_FONT_SIZE },
  smallPhoto: { width: SMALL_PHOTO_SIZE, height: SMALL_PHOTO_SIZE, borderRadius: SMALL_PHOTO_RADIUS },
  smallInitialsText: { fontSize: SMALL_INITIALS_FONT_SIZE },
});
