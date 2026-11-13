import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', gap: space.s3, padding: space.s4, borderRadius: radius.lg },
  texts: { flex: 1, gap: space.s1 },
});
