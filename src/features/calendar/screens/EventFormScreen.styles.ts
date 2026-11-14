import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const KEYBOARD_BEHAVIOR = 'padding';
export const SKELETON_HEIGHT = 320;
export const ERROR_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s4, paddingBottom: space.s6 },
  section: { gap: space.s2 },
  feedback: { gap: space.s3, alignItems: 'flex-start' },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: { flex: 1 },
});
