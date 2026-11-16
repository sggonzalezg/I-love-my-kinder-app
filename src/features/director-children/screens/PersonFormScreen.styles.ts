import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const KEYBOARD_BEHAVIOR = 'padding';
export const SKELETON_HEIGHTS = [56, 56, 56] as const;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s4, paddingBottom: space.s6 },
  error: { gap: space.s3, alignItems: 'flex-start', paddingTop: space.s4 },
});
