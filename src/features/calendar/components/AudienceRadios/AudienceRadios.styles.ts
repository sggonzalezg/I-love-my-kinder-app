import { StyleSheet } from 'react-native';

import { createThemedStyles } from '@/theme/themed-styles';
import { radius, space } from '@/theme/tokens';

const RADIO_MIN_HEIGHT = 56;
const DOT_SIZE = 24;
const DOT_RING_OFF = 2;
const DOT_RING_ON = 7;

export const styles = StyleSheet.create({
  group: { borderRadius: radius.lg, overflow: 'hidden' },
  divider: { height: 1 },
  radio: { flexDirection: 'row', alignItems: 'center', gap: space.s3, minHeight: RADIO_MIN_HEIGHT, paddingHorizontal: space.s4 },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2 },
});

export const useAudienceRadiosStyles = createThemedStyles((colors) => ({
  dotOff: { borderWidth: DOT_RING_OFF, borderColor: colors.muted },
  dotOn: { borderWidth: DOT_RING_ON, borderColor: colors.blue },
}));
