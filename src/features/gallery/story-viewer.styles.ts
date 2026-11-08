import { StyleSheet } from 'react-native';

import { STORY_PREVIOUS_TAP_FRACTION } from '@/constants/story';
import { lightColors, screenMargin, size, space } from '@/theme/tokens';

const BOTTOM_BAR_SPACE = size.touch + space.s4;
const PREVIOUS_ZONE_PERCENT = `${STORY_PREVIOUS_TAP_FRACTION * 100}%` as const;

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: lightColors.black },
  stage: { flex: 1, backgroundColor: lightColors.black, overflow: 'hidden' },
  media: { ...StyleSheet.absoluteFill },
  spinner: { ...StyleSheet.absoluteFill },
  tapZones: { ...StyleSheet.absoluteFill, flexDirection: 'row' },
  previousZone: { width: PREVIOUS_ZONE_PERCENT, height: '100%' },
  nextZone: { flex: 1, height: '100%' },
  top: { position: 'absolute', left: 0, right: 0, top: 0, paddingHorizontal: space.s3, gap: space.s3 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: screenMargin },
  toastLayer: { position: 'absolute', left: 0, right: 0, top: 0 },
});

export function topInsetStyle(topInset: number) {
  return { paddingTop: topInset + space.s2 };
}

export function bottomInsetStyle(bottomInset: number) {
  return { paddingBottom: bottomInset + space.s3 };
}

/** The toast sits above the bottom bar instead of over "Guardar". */
export function toastLayerInsetStyle(bottomInset: number) {
  return { bottom: bottomInset + BOTTOM_BAR_SPACE };
}
