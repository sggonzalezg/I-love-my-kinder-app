import { StyleSheet } from 'react-native';

import { lightColors, space } from '@/theme/tokens';

const MUTED_ON_DARK = 'rgba(255,255,255,0.8)';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s3 },
  who: { flex: 1 },
  onDark: { color: lightColors.white },
  onDarkMuted: { color: MUTED_ON_DARK },
});
