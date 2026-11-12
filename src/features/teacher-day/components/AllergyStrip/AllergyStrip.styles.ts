import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

export const ALLERGY_ICON_SIZE = 22;

export const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: space.s3, paddingVertical: 14, paddingHorizontal: space.s4, borderRadius: radius.lg, marginTop: space.s3 },
  text: { flex: 1 },
});
