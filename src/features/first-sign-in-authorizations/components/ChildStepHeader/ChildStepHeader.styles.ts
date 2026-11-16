import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

const PHOTO_SIZE = 64;
const PHOTO_RADIUS = 20;
const INITIALS_FONT_SIZE = 22;
const HEADER_GAP = 14;
const HEADER_BOTTOM_MARGIN = 6;

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: HEADER_GAP, marginTop: space.s3, marginBottom: HEADER_BOTTOM_MARGIN },
  photo: { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: PHOTO_RADIUS },
  initials: { alignItems: 'center', justifyContent: 'center' },
  initialsText: { fontFamily: fonts.display800, fontSize: INITIALS_FONT_SIZE },
  titles: { flex: 1 },
});
