import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  part: { gap: space.s3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s3, paddingHorizontal: space.s4, minHeight: ROW_MIN_HEIGHT },
  group: { flex: 1, minWidth: 0, alignItems: 'flex-start' },
  withdraw: { marginTop: space.s3 },
});
