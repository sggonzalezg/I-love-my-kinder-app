import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  block: { gap: space.s3 },
  countRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.s2 },
  count: { fontFamily: fonts.display900, fontSize: 44, lineHeight: 48, letterSpacing: -0.88 },
  of: { fontFamily: fonts.display800, fontSize: 20, lineHeight: 24 },
});
