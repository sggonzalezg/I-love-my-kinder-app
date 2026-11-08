import { StyleSheet } from 'react-native';

import { lightColors, space } from '@/theme/tokens';

const MUTED_ON_DARK = 'rgba(255,255,255,0.8)';

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: lightColors.black },
  stage: { flex: 1, backgroundColor: lightColors.black, overflow: 'hidden' },
  photo: { ...StyleSheet.absoluteFill },
  top: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: space.s3, flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  who: { flex: 1 },
  onDark: { color: lightColors.white },
  onDarkMuted: { color: MUTED_ON_DARK },
});

export function topInsetStyle(topInset: number) {
  return { paddingTop: topInset + space.s2 };
}
