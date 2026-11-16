import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  body: { gap: space.s4 },
  foot: { textAlign: 'center', marginTop: 'auto', paddingTop: space.s6 },
  footLink: { fontFamily: fonts.text600 },
});
