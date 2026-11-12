import { useEffect, useRef, type RefObject } from 'react';
import { AccessibilityInfo, type HostInstance } from 'react-native';

export function shouldReturnFocusToTrigger(wasOpen: boolean, isOpen: boolean): boolean {
  return wasOpen && !isOpen;
}

export function moveAccessibilityFocus(target: RefObject<HostInstance | null>) {
  if (target.current) AccessibilityInfo.sendAccessibilityEvent(target.current, 'focus');
}

export function useSheetAccessibilityFocus(isOpen: boolean) {
  const titleRef = useRef<HostInstance>(null);
  const triggerRef = useRef<HostInstance>(null);
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (shouldReturnFocusToTrigger(wasOpenRef.current, isOpen)) moveAccessibilityFocus(triggerRef);
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  return { titleRef, triggerRef, focusTitle: () => moveAccessibilityFocus(titleRef) };
}
