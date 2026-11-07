import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

const TOP_BAR_MIN_HEIGHT = 56;

export const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: space.s3, paddingTop: space.s2, paddingBottom: space.s3, paddingHorizontal: screenMargin, minHeight: TOP_BAR_MIN_HEIGHT },
  titles: { flex: 1 },
  right: { flexDirection: 'row', gap: space.s2 },
});
