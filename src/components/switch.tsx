import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { cssEaseOut, duration } from '@/theme/motion';
import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 32;
const KNOB_SIZE = 26;
const KNOB_INSET = (TRACK_HEIGHT - KNOB_SIZE) / 2;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - KNOB_INSET * 2;
const DISABLED_OPACITY = 0.5;

interface SwitchProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
  saving?: boolean;
  disabled?: boolean;
}

export function Switch({ value, onChange, label, saving = false, disabled = false }: SwitchProps) {
  const c = useColors();
  const reduced = useReducedMotion();
  const inactive = disabled || saving;
  const transitionDuration = reduced ? 0 : duration.base;

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled: inactive, busy: saving }}
      disabled={inactive}
      hitSlop={8}
      onPress={() => {
        Haptics.selectionAsync();
        onChange(!value);
      }}>
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: value ? c.blue : c.border,
            opacity: disabled ? DISABLED_OPACITY : 1,
            transitionProperty: 'backgroundColor',
            transitionDuration,
            transitionTimingFunction: cssEaseOut,
          },
        ]}>
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: c.white,
              transform: [{ translateX: value ? KNOB_TRAVEL : 0 }],
              transitionProperty: 'transform',
              transitionDuration,
              transitionTimingFunction: cssEaseOut,
            },
          ]}>
          {saving && <ActivityIndicator size="small" color={c.blue} />}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: TRACK_WIDTH, height: TRACK_HEIGHT, borderRadius: radius.full, padding: KNOB_INSET },
  knob: { width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
});
