import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const KEYBOARD_BEHAVIOR = 'padding';
export const SKELETON_HEIGHT = 40;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s3, paddingBottom: space.s6 },
  shift: { gap: space.s2 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
