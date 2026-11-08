import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/** Runs `reload` each time the screen is focused again (not on its first focus, which already loaded). */
export function useReloadOnRefocus(reload: () => void) {
  const focusedBefore = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (focusedBefore.current) reload();
      focusedBefore.current = true;
    }, [reload]),
  );
}
