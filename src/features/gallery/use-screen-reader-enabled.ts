import { useEffect, useReducer } from 'react';
import { AccessibilityInfo } from 'react-native';

function latestValue(_previous: boolean, next: boolean): boolean {
  return next;
}

export function useScreenReaderEnabled(): boolean {
  const [enabled, setEnabled] = useReducer(latestValue, false);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => isMounted && setEnabled(value))
      .catch((error: unknown) => console.warn('Screen reader check failed:', error));
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setEnabled);
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return enabled;
}
