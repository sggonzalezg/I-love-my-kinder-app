import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

const MOMENT_WIDTH = 88;

export const styles = StyleSheet.create({
  history: { gap: space.s2 },
  row: { flexDirection: 'row', gap: space.s3 },
  moment: { width: MOMENT_WIDTH },
  text: { flex: 1 },
});
