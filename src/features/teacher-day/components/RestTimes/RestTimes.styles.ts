import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const ERROR_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s2 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
});
