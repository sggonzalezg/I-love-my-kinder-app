import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const LOGO_WIDTH = 132;
// The client logo file is 1084 × 1003.
const LOGO_ASPECT_RATIO = 1084 / 1003;
const TITLE_SIZE = 30;
const LEDE_MAX_WIDTH = 280;

export const styles = StyleSheet.create({
  head: { alignItems: 'center', paddingTop: space.s10, paddingBottom: space.s6 },
  logo: { width: LOGO_WIDTH, aspectRatio: LOGO_ASPECT_RATIO },
  title: { fontSize: TITLE_SIZE, lineHeight: TITLE_SIZE * 1.1, textAlign: 'center', marginTop: space.s5, marginBottom: space.s2 },
  lede: { textAlign: 'center', maxWidth: LEDE_MAX_WIDTH },
});
