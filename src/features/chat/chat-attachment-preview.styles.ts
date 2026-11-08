import { StyleSheet, type DimensionValue } from 'react-native';
import { Keyframe, ReduceMotion } from 'react-native-reanimated';

import { cssEaseOut, duration, easeOut } from '@/theme/motion';
import { radius, size, space } from '@/theme/tokens';

const PREVIEW_SIZE = 112;
const PLATE_SIZE = 28;
const PLATE_COLOR = 'rgba(13,20,38,0.72)';
const TRACK_HEIGHT = 6;
const TRACK_INSET = 6;
const ENTER_SCALE = 0.96;
const PERCENT = 100;
export const PLATE_ICON_SIZE = 16;
export const RETRY_ICON_SIZE = 16;

export const ATTACHMENT_ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ scale: ENTER_SCALE }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: easeOut },
})
  .duration(duration.base)
  .reduceMotion(ReduceMotion.System);

export const styles = StyleSheet.create({
  root: { marginLeft: size.touch + space.s2, marginBottom: space.s2, gap: space.s1 },
  preview: { width: PREVIEW_SIZE, height: PREVIEW_SIZE, borderRadius: radius.md, overflow: 'hidden' },
  image: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
  remove: { position: 'absolute', top: 2, right: 2 },
  removeTouch: { width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
  plate: { width: PLATE_SIZE, height: PLATE_SIZE, borderRadius: PLATE_SIZE / 2, backgroundColor: PLATE_COLOR, alignItems: 'center', justifyContent: 'center' },
  track: { position: 'absolute', left: TRACK_INSET, right: TRACK_INSET, bottom: TRACK_INSET, height: TRACK_HEIGHT, borderRadius: TRACK_HEIGHT / 2, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: TRACK_HEIGHT / 2 },
  error: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: size.touch },
});

// The fill is out of flow and childless, so animating its width re-lays out nothing else.
export function progressFillStyle(fraction: number) {
  return {
    width: `${fraction * PERCENT}%` as DimensionValue,
    transitionProperty: 'width',
    transitionDuration: duration.fast,
    transitionTimingFunction: cssEaseOut,
  } as const;
}
