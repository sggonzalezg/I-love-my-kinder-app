import { StyleSheet } from 'react-native';

import { screenMargin, space, type as typeScale } from '@/theme/tokens';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingTop: space.s2, paddingBottom: space.s1, paddingHorizontal: screenMargin },
  text: { flex: 1, minWidth: 0 },
  name: typeScale.childName,
  meta: { flexDirection: 'row', alignItems: 'center' },
  metaText: typeScale.small,
});
