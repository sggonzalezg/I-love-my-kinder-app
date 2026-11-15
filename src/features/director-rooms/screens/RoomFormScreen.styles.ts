import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const KEYBOARD_BEHAVIOR = 'padding';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s4, paddingBottom: space.s6 },
});
