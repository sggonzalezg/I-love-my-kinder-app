import { StyleSheet } from 'react-native';

import { radius, space } from '@/theme/tokens';

const CHIP_HEIGHT = 40;
export const FILTER_ICON_SIZE = 18;

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s2, paddingBottom: space.s3 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, height: CHIP_HEIGHT, paddingHorizontal: space.s4, borderRadius: radius.full },
});
