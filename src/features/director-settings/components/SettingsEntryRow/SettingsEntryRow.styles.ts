import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const ROW_ICON_SIZE = 24;
const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  list: { borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  text: { flex: 1, minWidth: 0 },
});
