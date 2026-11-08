import { useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming, Extrapolation } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import {
  STORY_CLOSE_DISTANCE,
  STORY_CLOSE_VELOCITY,
  STORY_DRAG_MIN_SCALE,
  STORY_PAN_MIN_DISTANCE,
  STORY_SWIPE_DISTANCE,
  STORY_SWIPE_VELOCITY,
} from '@/constants/story';
import { duration, easeOut, pressSpring } from '@/theme/motion';

import type { StoryDirection } from './story-viewer-reducer';

interface StoryGestureHandlers {
  onClose: () => void;
  onSwipeDay: (direction: StoryDirection) => void;
}

/** Drag down closes (scaling to .9), a sideways swipe jumps a day; with reduced motion the drag does not move and closing fades. */
export function useStoryGestures({ onClose, onSwipeDay }: StoryGestureHandlers) {
  const reduced = useReducedMotion();
  const { height } = useWindowDimensions();
  const dragY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const stageStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [
      { translateY: dragY.get() },
      { scale: interpolate(dragY.get(), [0, height], [1, STORY_DRAG_MIN_SCALE], Extrapolation.CLAMP) },
    ],
  }));

  const gesture = Gesture.Pan()
    .minDistance(STORY_PAN_MIN_DISTANCE)
    .onUpdate((event) => {
      const downward = event.translationY > 0 && Math.abs(event.translationY) > Math.abs(event.translationX);
      if (downward && !reduced) dragY.set(event.translationY);
    })
    .onEnd((event) => {
      const horizontal = Math.abs(event.translationX) > Math.abs(event.translationY);
      if (horizontal) {
        if (Math.abs(event.translationX) > STORY_SWIPE_DISTANCE || Math.abs(event.velocityX) > STORY_SWIPE_VELOCITY) {
          scheduleOnRN(onSwipeDay, event.translationX < 0 ? 1 : -1);
        }
        return;
      }
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

  return { gesture, stageStyle };
}
