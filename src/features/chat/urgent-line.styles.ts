import { StyleSheet } from 'react-native';

import { size, space } from '@/theme/tokens';

export const URGENT_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  line: { flexDirection: 'row', alignItems: 'center', gap: space.s2, minHeight: size.touch, paddingHorizontal: space.s4 },
  text: { flex: 1 },
});
