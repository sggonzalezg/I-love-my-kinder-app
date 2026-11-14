import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const ROW_MIN_HEIGHT = 64;

export const styles = StyleSheet.create({
  row: { minHeight: ROW_MIN_HEIGHT, paddingVertical: space.s3, paddingHorizontal: space.s4, justifyContent: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3 },
  name: { flexShrink: 1 },
  track: { marginTop: space.s2 },
  missing: { marginTop: space.s2 },
});
