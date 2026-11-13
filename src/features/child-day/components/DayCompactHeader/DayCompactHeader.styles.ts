import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingTop: space.s2, paddingHorizontal: screenMargin },
  name: { flex: 1 },
});
