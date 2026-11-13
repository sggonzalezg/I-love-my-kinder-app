import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const CAKE_ICON_SIZE = 24;

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: space.s3, padding: space.s4, borderRadius: radius.lg },
  text: { flex: 1, minWidth: 0 },
});
