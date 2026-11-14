import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SHEET_DRAG_ACTIVATION, SHEET_DRAG_HORIZONTAL_FAIL } from '@/constants/sheet';
import { sheetDragOffset, shouldCloseSheet } from '@/lib/sheet-drag';
import { duration, easeOut } from '@/theme/motion';

const SNAP_BACK_SPRING = { duration: 300, dampingRatio: 0.8 } as const;

function closeHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Drag a sheet down to close it; with reduced motion it does not follow the finger, but the same swipe still closes it. */
export function useSheetDragToClose(visible: boolean, onClose: () => void) {
  const reduced = useReducedMotion();
  const dragY = useSharedValue(0);
  const sheetHeight = useSharedValue(0);

  useEffect(() => {
    if (visible) dragY.set(0);
  }, [visible, dragY]);

  const onSheetLayout = (event: LayoutChangeEvent) => sheetHeight.set(event.nativeEvent.layout.height);

  const gesture = Gesture.Pan()
    .activeOffsetY([-SHEET_DRAG_ACTIVATION, SHEET_DRAG_ACTIVATION])
    .failOffsetX([-SHEET_DRAG_HORIZONTAL_FAIL, SHEET_DRAG_HORIZONTAL_FAIL])
    .onUpdate((event) => {
      if (reduced) return;
      dragY.set(sheetDragOffset(event.translationY));
    })
    .onEnd((event) => {
      if (!shouldCloseSheet(event.translationY, event.velocityY, sheetHeight.get())) {
        dragY.set(withSpring(0, { ...SNAP_BACK_SPRING, velocity: event.velocityY }));
        return;
      }
      scheduleOnRN(closeHaptic);
      if (reduced) {
        scheduleOnRN(onClose);
        return;
      }
      dragY.set(
        withTiming(sheetHeight.get(), { duration: duration.base, easing: easeOut }, (finished) => {
          if (finished) scheduleOnRN(onClose);
        }),
      );
    });

  const dragStyle = useAnimatedStyle(() => ({ transform: [{ translateY: dragY.get() }] }));

  return { gesture, dragStyle, onSheetLayout };
}
