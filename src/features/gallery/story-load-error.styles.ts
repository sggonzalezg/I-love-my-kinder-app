import { StyleSheet } from 'react-native';

import { lightColors, space } from '@/theme/tokens';

export const ERROR_ICON_SIZE = 32;
const DIMMED_LAYER = 'rgba(0,0,0,0.65)';
const BODY_ON_DARK = 'rgba(255,255,255,0.9)';

export const styles = StyleSheet.create({
  block: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.s3,
    paddingHorizontal: space.s6,
    backgroundColor: DIMMED_LAYER,
  },
  title: { color: lightColors.white, textAlign: 'center' },
  body: { color: BODY_ON_DARK, textAlign: 'center', marginBottom: space.s2 },
});
