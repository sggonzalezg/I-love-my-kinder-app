import { useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { clamp, Extrapolation, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { PHOTO_MAX_ZOOM } from '@/constants/chat';
import { STORY_CLOSE_DISTANCE, STORY_CLOSE_VELOCITY, STORY_DRAG_MIN_SCALE, STORY_PAN_MIN_DISTANCE } from '@/constants/story';
import { duration, easeOut, pressSpring } from '@/theme/motion';

const NO_ZOOM = 1;
const DOUBLE_TAP = 2;

/** Pinch zooms (double tap resets); drag down closes, scaling to .9, only while not zoomed; with reduced motion closing fades. */
export function usePhotoViewerGestures(onClose: () => void) {
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();
  const zoom = useSharedValue(NO_ZOOM);
  const zoomAtStart = useSharedValue(NO_ZOOM);
  const dragY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const stageStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: dragY.get() }, { scale: interpolate(dragY.get(), [0, height], [1, STORY_DRAG_MIN_SCALE], Extrapolation.CLAMP) }],
  }));
  const photoStyle = useAnimatedStyle(() => ({ transform: [{ scale: zoom.get() }] }));

  const pinch = Gesture.Pinch()
    .onStart(() => zoomAtStart.set(zoom.get()))
    .onUpdate((event) => zoom.set(clamp(zoomAtStart.get() * event.scale, NO_ZOOM, PHOTO_MAX_ZOOM)));

  const resetZoom = Gesture.Tap()
    .numberOfTaps(DOUBLE_TAP)
    .onEnd(() => zoom.set(withTiming(NO_ZOOM, { duration: duration.base, easing: easeOut })));

  const dragToClose = Gesture.Pan()
    .minDistance(STORY_PAN_MIN_DISTANCE)
    .onUpdate((event) => {
      if (zoom.get() > NO_ZOOM || reduced) return;
      dragY.set(Math.max(event.translationY, 0));
    })
    .onEnd((event) => {
      if (zoom.get() > NO_ZOOM) return;
      const closing = event.translationY > STORY_CLOSE_DISTANCE || event.velocityY > STORY_CLOSE_VELOCITY;
      if (!closing) {
        dragY.set(withSpring(0, { ...pressSpring, velocity: event.velocityY }));
        return;
      }
      const finish = (finished?: boolean) => {
        'worklet';
        if (finished) scheduleOnRN(onClose);
      };
      if (reduced) opacity.set(withTiming(0, { duration: duration.fast }, finish));
      else dragY.set(withTiming(height, { duration: duration.base, easing: easeOut }, finish));
    });

  return { gesture: Gesture.Simultaneous(pinch, dragToClose, resetZoom), stageStyle, photoStyle };
}
