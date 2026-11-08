import { StyleSheet } from 'react-native';

import { lightColors, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.s3 },
  label: { flex: 1, color: lightColors.white },
});
