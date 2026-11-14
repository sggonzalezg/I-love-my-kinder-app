import { StyleSheet } from 'react-native';

import { duration } from '@/theme/motion';
import { fonts, radius, space } from '@/theme/tokens';

export const HEART_SIZE = 20;
const PHOTO_HEIGHT = 168;
const CAPTION_TOP_PADDING = 32;
const CAPTION_BOTTOM_PADDING = 14;

// Design section 7: the heart beats on the birthday card; with reduced motion it stays still.
export const heartBeat = {
  animationName: { '0%': { transform: [{ scale: 1 }] }, '30%': { transform: [{ scale: 1.18 }] }, '60%': { transform: [{ scale: 1 }] } },
  animationDuration: duration.beat,
  animationIterationCount: 'infinite',
} as const;

export const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, overflow: 'hidden' },
  photo: { width: '100%', height: PHOTO_HEIGHT },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: CAPTION_TOP_PADDING,
    paddingBottom: CAPTION_BOTTOM_PADDING,
    paddingHorizontal: space.s4,
    experimental_backgroundImage: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.6))',
  },
  title: { flexDirection: 'row', alignItems: 'center', gap: space.s2 },
  titleText: { fontFamily: fonts.display800, fontSize: 20, lineHeight: 24 },
});
