import { StyleSheet } from 'react-native';

import { fonts, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: space.s4, marginBottom: space.s2 },
  title: { fontFamily: fonts.text700, fontSize: 16, lineHeight: 22 },
});
