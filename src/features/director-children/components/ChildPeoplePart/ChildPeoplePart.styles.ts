import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_ROW_HEIGHTS = [64, 64] as const;

export const styles = StyleSheet.create({
  part: { gap: space.s3 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  error: { gap: space.s3, alignItems: 'flex-start', paddingTop: space.s4 },
});
