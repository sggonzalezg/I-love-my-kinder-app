import { StyleSheet } from 'react-native';

import { fonts, radius, size } from '@/theme/tokens';

export const styles = StyleSheet.create({
  pill: { height: size.touch, paddingHorizontal: 16, borderRadius: radius.full, justifyContent: 'center', flexShrink: 1 },
  label: { fontFamily: fonts.text600, fontSize: 15, lineHeight: 18 },
});
