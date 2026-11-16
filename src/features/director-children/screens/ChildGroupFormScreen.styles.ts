import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const SKELETON_HEIGHTS = [40, 40] as const;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s4, paddingBottom: space.s6 },
  shift: { gap: space.s2 },
  error: { gap: space.s3, alignItems: 'flex-start', paddingTop: space.s4 },
});
