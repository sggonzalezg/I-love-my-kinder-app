import { Check, type LucideIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated';

import { duration, easeOut } from '@/theme/motion';
import { radius, screenMargin, shadow, space } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';
import { Text } from './text';

export const TOAST_VISIBLE_MS = 3000;

export function Toast({ message, icon: Icon = Check }: { message: string; icon?: LucideIcon }) {
  const c = useColors();
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      entering={FadeInDown.duration(duration.base).easing(easeOut).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(duration.exitBase)}
      style={[styles.toast, shadow.toast, { backgroundColor: c.ink }]}>
      <Icon size={18} color={c.ground} strokeWidth={2.4} />
      <Text variant="smallStrong" color="ground">
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: screenMargin,
    right: screenMargin,
    bottom: space.s8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.s2,
    padding: space.s4,
    borderRadius: radius.md,
  },
});
