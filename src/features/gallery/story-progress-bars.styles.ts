import { StyleSheet } from 'react-native';

import { lightColors, radius, space } from '@/theme/tokens';

const BAR_HEIGHT = 3;
const TRACK_COLOR = 'rgba(255,255,255,0.35)';

// The viewer is always black, so its bars use fixed white in light and dark mode.
export const styles = StyleSheet.create({
  bars: { flexDirection: 'row', gap: space.s1 },
  track: { flex: 1, height: BAR_HEIGHT, borderRadius: radius.full, backgroundColor: TRACK_COLOR, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: lightColors.white },
  full: { width: '100%' },
});
