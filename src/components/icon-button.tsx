import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { badgeText } from '@/lib/format';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ICON_BUTTON_ICON_SIZE, styles } from './icon-button.styles';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

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
        <View style={[styles.badge, backgroundStyles.red]} importantForAccessibility="no">
          <Text tone="onRed" style={styles.badgeText}>
            {count}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}
