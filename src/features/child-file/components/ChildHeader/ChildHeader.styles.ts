import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingBottom: space.s4 },
  text: { flex: 1 },
});
