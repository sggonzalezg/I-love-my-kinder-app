import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_ROW_HEIGHTS = [64, 64] as const;

export const styles = StyleSheet.create({
  skeletons: { gap: space.s3 },
  error: { gap: space.s3, alignItems: 'flex-start', paddingTop: space.s4 },
});
