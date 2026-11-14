import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const ICON_SIZE = 16;
const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  text: { flex: 1, minWidth: 0 },
  allergy: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
});
