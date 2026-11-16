import { StyleSheet } from 'react-native';
import { FadeIn, Keyframe } from 'react-native-reanimated';

import { STEP_MOVES, type StepMove } from '@/features/first-sign-in-authorizations/first-sign-in-reducer';
import { duration, easeOut } from '@/theme/motion';
import { screenMargin, space } from '@/theme/tokens';

export const QUESTION_SKELETON_HEIGHT = 168;
const STEP_SHIFT = 24;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: screenMargin, paddingBottom: space.s6, gap: space.s3 },
  step: { gap: space.s3 },
  lede: { marginBottom: space.s1 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});

// Design section 7, "Next child": the step comes in from the side it was reached from; a short cross-fade with reduced motion.
export function stepEntering(move: StepMove, reduced: boolean) {
  if (reduced) return FadeIn.duration(duration.fast);
  const startShift = move === STEP_MOVES.back ? -STEP_SHIFT : STEP_SHIFT;
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateX: startShift }] },
    100: { opacity: 1, transform: [{ translateX: 0 }], easing: easeOut },
  }).duration(duration.slow);
}
