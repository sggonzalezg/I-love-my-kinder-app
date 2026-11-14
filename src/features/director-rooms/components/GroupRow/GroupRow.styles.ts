import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const ROW_VERTICAL_PADDING = 10;
const ROW_MIN_HEIGHT = 56;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  info: { flex: 1, paddingVertical: ROW_VERTICAL_PADDING, minHeight: ROW_MIN_HEIGHT, justifyContent: 'center' },
  chip: { marginTop: space.s1, alignSelf: 'flex-start' },
});
