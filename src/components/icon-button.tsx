import type { LucideIcon } from 'lucide-react-native';
import Animated, { Keyframe, ReduceMotion } from 'react-native-reanimated';

import { badgeText } from '@/lib/format';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { duration, easeOut } from '@/theme/motion';
import { useColors } from '@/theme/use-theme';

import { ICON_BUTTON_ICON_SIZE, styles } from './icon-button.styles';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

// Design section 7: a new count pops like the bell badge (scale 0 → 1.25 → 1); with reduced motion the number just swaps.
const BADGE_POP = new Keyframe({
  0: { transform: [{ scale: 0 }] },
  60: { transform: [{ scale: 1.25 }], easing: easeOut },
  100: { transform: [{ scale: 1 }] },
})
  .duration(duration.slow)
  .reduceMotion(ReduceMotion.System);

type Props = {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
  ghost?: boolean;
  badge?: number;
  disabled?: boolean;
};

export function IconButton({ icon: Icon, label, onPress, ghost, badge = 0, disabled }: Props) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const count = badgeText(badge);
  const background = (pressed: boolean) => {
    if (ghost) return backgroundStyles.transparent;
    return pressed ? backgroundStyles.raised : backgroundStyles.surface;
  };
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.base, background(pressed)]}>
      <Icon size={ICON_BUTTON_ICON_SIZE} color={disabled ? colors.muted : colors.ink} strokeWidth={1.8} />
      {count && (
        <Animated.View key={count} entering={BADGE_POP} style={[styles.badge, backgroundStyles.red]} importantForAccessibility="no">
          <Text tone="onRed" style={styles.badgeText}>
            {count}
          </Text>
        </Animated.View>
      )}
    </PressableScale>
  );
}
