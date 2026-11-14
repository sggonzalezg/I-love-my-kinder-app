import { StyleSheet } from 'react-native';

import { screenMargin, space } from '@/theme/tokens';

export const SKELETON_CARD_HEIGHT = 168;
export const SKELETON_ROW_HEIGHT = 64;
export const SKELETON_ROWS = 4;
const TOP_BAR_MIN_HEIGHT = 56;

export const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingTop: space.s2, paddingBottom: space.s3, paddingHorizontal: screenMargin, minHeight: TOP_BAR_MIN_HEIGHT },
  skeleton: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
