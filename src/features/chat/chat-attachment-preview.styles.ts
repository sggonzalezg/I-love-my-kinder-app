import { StyleSheet, type DimensionValue } from 'react-native';

import { cssEaseOut, duration } from '@/theme/motion';
import { mediaPlateColor, radius, size, space } from '@/theme/tokens';

const PREVIEW_SIZE = 112;
const PLATE_SIZE = 28;
const TRACK_HEIGHT = 6;
const TRACK_INSET = 6;
const PERCENT = 100;
export const PLATE_ICON_SIZE = 16;
export const RETRY_ICON_SIZE = 16;

export const styles = StyleSheet.create({
  root: { marginLeft: size.touch + space.s2, marginBottom: space.s2, gap: space.s1 },
  preview: { width: PREVIEW_SIZE, height: PREVIEW_SIZE, borderRadius: radius.md, overflow: 'hidden' },
  image: { width: PREVIEW_SIZE, height: PREVIEW_SIZE },
  remove: { position: 'absolute', top: 2, right: 2 },
  removeTouch: { width: size.touch, height: size.touch, alignItems: 'center', justifyContent: 'center' },
  plate: { width: PLATE_SIZE, height: PLATE_SIZE, borderRadius: PLATE_SIZE / 2, backgroundColor: mediaPlateColor, alignItems: 'center', justifyContent: 'center' },
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
