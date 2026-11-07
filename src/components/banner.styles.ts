import { StyleSheet } from 'react-native';

import { radius, type ColorName } from '@/theme/tokens';

export type BannerKind = 'offline' | 'info' | 'error';

export const BANNER_PALETTES: Record<BannerKind, { background: ColorName; icon: ColorName }> = {
  offline: { background: 'wait50', icon: 'wait' },
  info: { background: 'blue50', icon: 'blue' },
  error: { background: 'red50', icon: 'red' },
};

export const BANNER_ICON_SIZE = 20;

export const styles = StyleSheet.create({
  banner: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 12, borderRadius: radius.md },
  text: { flex: 1 },
});
