import { StyleSheet } from 'react-native';

import { radius, size, space } from '@/theme/tokens';

const ROW_MIN_HEIGHT = 56;
const ROW_VERTICAL_PADDING = 6;
const PILL_PADDING = 14;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s2, minHeight: ROW_MIN_HEIGHT, paddingVertical: ROW_VERTICAL_PADDING, paddingHorizontal: space.s4 },
  name: { flex: 1 },
  pill: { minHeight: size.touch, paddingHorizontal: PILL_PADDING, borderRadius: radius.md, justifyContent: 'center' },
});
