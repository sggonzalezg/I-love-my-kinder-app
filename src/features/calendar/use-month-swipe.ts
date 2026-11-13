import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { pressSpring } from '@/theme/motion';

const MONTH_SWIPE_DISTANCE = 50;
const MONTH_SWIPE_VELOCITY = 500;
const MONTH_PAN_ACTIVE_OFFSET: [number, number] = [-12, 12];

/** A sideways swipe on the grid changes the month; the grid follows the finger and springs back, and stays still with reduced motion. */
export function useMonthSwipe(onShift: (step: 1 | -1) => void) {
  const reduced = useReducedMotion();
  const dragX = useSharedValue(0);

  const gridStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dragX.get() }] }));

  const gesture = Gesture.Pan()
    .activeOffsetX(MONTH_PAN_ACTIVE_OFFSET)
    .onUpdate((event) => {
      if (!reduced) dragX.set(event.translationX);
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > MONTH_SWIPE_DISTANCE || Math.abs(event.velocityX) > MONTH_SWIPE_VELOCITY) {
        scheduleOnRN(onShift, event.translationX < 0 ? 1 : -1);
      }
      dragX.set(withSpring(0, { ...pressSpring, velocity: event.velocityX }));
    });

  return { gesture, gridStyle };
}
