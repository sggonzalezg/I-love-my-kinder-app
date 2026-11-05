import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { duration, easeOut } from '@/theme/motion';

type Props = PressableProps & {
  /** Style of the animated wrapper (layout: alignSelf, flex, margins). */
  containerStyle?: StyleProp<ViewStyle>;
  /** design.md section 7: .97 buttons, .98 cards, .96 choices. */
  pressedScale?: number;
  haptic?: 'selection' | 'light' | null;
};

/**
 * Press feedback: scale on press-in (120 ms out), back on release; the caller draws the pressed
 * colour from `pressed`. Reduced motion keeps only that colour change. Haptic fires with the visual.
 */
export function PressableScale({ pressedScale = 0.97, haptic = null, containerStyle, onPressIn, onPressOut, ...rest }: Props) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={[containerStyle, animated]}>
      <Pressable
        hitSlop={8}
        pressRetentionOffset={16}
        {...rest}
        onPressIn={(e) => {
          if (!reduced) scale.set(withTiming(pressedScale, { duration: duration.fast, easing: easeOut }));
          if (haptic === 'selection') Haptics.selectionAsync();
          if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.set(withTiming(1, { duration: duration.fast, easing: easeOut }));
          onPressOut?.(e);
        }}
      />
    </Animated.View>
  );
}
