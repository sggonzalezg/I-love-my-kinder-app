import { StyleSheet } from 'react-native';

import { radius, screenMargin, space } from '@/theme/tokens';

const LOGO_WIDTH = 64;
const LOGO_HEIGHT = 40;
const LOGO_PLATE_PADDING = 2;
const TOP_BAR_MIN_HEIGHT = 56;
const GREETING_FONT_SIZE = 20;

export const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingTop: space.s2, paddingBottom: space.s3, paddingHorizontal: screenMargin, minHeight: TOP_BAR_MIN_HEIGHT },
  logoPlate: { borderRadius: radius.lg, padding: LOGO_PLATE_PADDING },
  logo: { width: LOGO_WIDTH, height: LOGO_HEIGHT },
  greeting: { flex: 1, fontSize: GREETING_FONT_SIZE },
});
