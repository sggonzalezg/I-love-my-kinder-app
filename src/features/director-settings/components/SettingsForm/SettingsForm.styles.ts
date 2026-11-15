import { StyleSheet } from 'react-native';

import { space } from '@/theme/tokens';

export const KEYBOARD_BEHAVIOR = 'padding';
/** The wheel steps through the whole day: shift times are not limited to what already happened. */
export const LATEST_SHIFT_TIME = { hours: 23, minutes: 59 } as const;
export const SHIFT_TIME_MINUTE_STEP = 5;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  form: { gap: space.s3, paddingBottom: space.s6 },
  shifts: { gap: space.s2, marginTop: space.s4 },
});
