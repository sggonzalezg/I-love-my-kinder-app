import { StyleSheet } from 'react-native';

import { space, type } from '@/theme/tokens';

const ILLUSTRATION_SIZE = 168;

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.s6 },
  illustration: { width: ILLUSTRATION_SIZE, height: ILLUSTRATION_SIZE, borderRadius: ILLUSTRATION_SIZE / 2, marginBottom: space.s5 },
  title: { fontWeight: '600', textAlign: 'center' },
  description: { fontSize: type.small.fontSize, textAlign: 'center', marginTop: space.s3 },
});
