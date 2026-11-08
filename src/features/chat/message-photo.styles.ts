import { StyleSheet } from 'react-native';

import { duration } from '@/theme/motion';
import { space } from '@/theme/tokens';

const PHOTO_WIDTH = 220;
const PHOTO_HEIGHT = 240;
const BLOCK_MIN_HEIGHT = 96;
const PHOTO_RADIUS = 10;
export const BLOCK_ICON_SIZE = 20;
export const PHOTO_FADE_MS = duration.fast;

export const styles = StyleSheet.create({
  photo: { width: PHOTO_WIDTH, height: PHOTO_HEIGHT, borderRadius: PHOTO_RADIUS, overflow: 'hidden' },
  block: {
    width: PHOTO_WIDTH,
    minHeight: BLOCK_MIN_HEIGHT,
    borderRadius: PHOTO_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: space.s3,
  },
  blockText: { textAlign: 'center' },
});
