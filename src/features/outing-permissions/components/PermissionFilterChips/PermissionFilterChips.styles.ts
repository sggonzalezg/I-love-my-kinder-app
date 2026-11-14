import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.s2, paddingTop: space.s3, paddingBottom: 10 },
  chip: { justifyContent: 'center', height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full },
});
