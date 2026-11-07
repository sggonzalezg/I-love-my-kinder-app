import { StyleSheet } from 'react-native';

import { space, type } from '@/theme/tokens';

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.s6 },
  title: { fontWeight: '600', textAlign: 'center' },
  description: { fontSize: type.small.fontSize, textAlign: 'center', marginTop: space.s3 },
});
