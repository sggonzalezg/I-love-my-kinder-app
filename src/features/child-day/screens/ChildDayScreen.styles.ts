import { StyleSheet } from 'react-native';
import { FadeInLeft, FadeInRight } from 'react-native-reanimated';

import type { EnterSide } from '@/features/child-day/child-day-reducer';
import { duration, easeOut } from '@/theme/motion';
import { screenMargin, space } from '@/theme/tokens';

// Design section 7, shift switch: the new shift enters 16 px from the side of the tapped segment and fades in.
const SHIFT_ENTER_DISTANCE = 16;
const SKELETON_BLOCKS = 3;
const SKELETON_BLOCK_HEIGHT = 96;

export const SKELETON = { blocks: SKELETON_BLOCKS, blockHeight: SKELETON_BLOCK_HEIGHT, titleHeight: 28, titleWidth: '60%' } as const;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: space.s6 },
  content: { paddingHorizontal: screenMargin, paddingTop: space.s3, gap: space.s3 },
  titles: { gap: space.s1 },
  message: { gap: space.s3, alignItems: 'flex-start', paddingHorizontal: screenMargin, paddingTop: space.s4 },
  empty: { paddingVertical: space.s8 },
});

export function topInsetStyle(topInset: number) {
  return { paddingTop: topInset };
}

export function shiftEntering(enterFrom: EnterSide | null, reduced: boolean) {
  if (!enterFrom || reduced) return undefined;
  const offset = enterFrom === 'right' ? SHIFT_ENTER_DISTANCE : -SHIFT_ENTER_DISTANCE;
  const entering = enterFrom === 'right' ? FadeInRight : FadeInLeft;
  return entering.duration(duration.base).easing(easeOut).withInitialValues({ transform: [{ translateX: offset }] });
}
