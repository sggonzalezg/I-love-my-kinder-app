import { StyleSheet } from 'react-native';
import { FadeInRight, FadeOutLeft, ReduceMotion } from 'react-native-reanimated';

import { easeOut } from '@/theme/motion';
import { screenMargin, space } from '@/theme/tokens';

// Design section 7, "Save and next": the current child leaves left and fades in 180 ms, the next one comes from the right in 260 ms.
const CHILD_EXIT_MS = 180;
const CHILD_ENTER_MS = 260;
const CHILD_TRAVEL = 24;

export const CHILD_EXITING = FadeOutLeft.duration(CHILD_EXIT_MS).reduceMotion(ReduceMotion.System);
export const CHILD_ENTERING = FadeInRight.duration(CHILD_ENTER_MS)
  .delay(CHILD_EXIT_MS)
  .easing(easeOut)
  .withInitialValues({ transform: [{ translateX: CHILD_TRAVEL }] })
  .reduceMotion(ReduceMotion.System);

// Android too: with edge-to-edge the window no longer resizes for the keyboard (same as the chat composer).
export const KEYBOARD_BEHAVIOR = 'padding';
export const SKELETON_BLOCK_HEIGHT = 320;

export const styles = StyleSheet.create({
  fill: { flex: 1 },
  margins: { paddingHorizontal: screenMargin, gap: space.s2 },
  track: { marginTop: space.s2 },
  body: { paddingHorizontal: screenMargin, paddingBottom: space.s4 },
  error: { gap: space.s3, alignItems: 'flex-start' },
});
