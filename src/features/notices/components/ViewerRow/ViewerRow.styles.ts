import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SEEN_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingVertical: space.s2 },
  texts: { flex: 1, minWidth: 0 },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.s1 },
});
