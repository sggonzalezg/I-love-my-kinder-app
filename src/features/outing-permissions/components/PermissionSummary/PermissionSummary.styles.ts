import { StyleSheet } from 'react-native';
import type { CSSAnimationProperties } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { fonts, radius, space } from '@/theme/tokens';

export const TILE_ICON_SIZE = 16;
const TILE_NUMBER_SIZE = 28;
const BAR_HEIGHT = 10;
const BAR_GAP = 3;
const TILE_LABEL_GAP = 5;

export const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: space.s2 },
  tile: { flex: 1, borderRadius: radius.md, paddingTop: 10, paddingHorizontal: 10, paddingBottom: space.s3, gap: space.s1 },
  tileNumber: { fontFamily: fonts.display900, fontSize: TILE_NUMBER_SIZE, lineHeight: TILE_NUMBER_SIZE },
  tileLabel: { flexDirection: 'row', alignItems: 'center', gap: TILE_LABEL_GAP },
  tileLabelText: { fontFamily: fonts.text600 },
  bar: { flexDirection: 'row', gap: BAR_GAP, height: BAR_HEIGHT, marginTop: space.s3, marginBottom: space.s1 },
  barPart: { borderRadius: BAR_HEIGHT / 2, transformOrigin: 'left' },
});

export function barPartStyle(count: number) {
  return { flex: count };
}

export const barGrowAnimation: CSSAnimationProperties = {
  animationName: { from: { transform: [{ scaleX: 0 }] }, to: { transform: [{ scaleX: 1 }] } },
  animationDuration: duration.slow,
  animationTimingFunction: cssEaseOut,
};
