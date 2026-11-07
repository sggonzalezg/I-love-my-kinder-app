import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { BUTTON_ICON_SIZE, BUTTON_PALETTES, buttonHeightStyle, styles } from './button.styles';
import { PressableScale } from './pressable-scale';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'soft' | 'plain' | 'danger' | 'danger-soft' | 'ghost' | 'secondary';

type Props = {
  label?: string;
  title?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  height?: number;
  style?: ViewStyle;
  accessibilityHint?: string;
};

export function Button({ label, title, onPress, variant = 'primary', icon: Icon, disabled, loading, block, height = size.button, style: containerStyle, accessibilityHint }: Props) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const text = label || title || '';

  const palette = BUTTON_PALETTES[variant === 'secondary' ? 'soft' : variant];
  const off = disabled || loading;
  const foreground = disabled ? 'muted' : palette.label;
  const background = (pressed: boolean) => {
    if (disabled) return backgroundStyles.raised;
    return backgroundStyles[pressed ? palette.pressed : palette.idle];
  };

  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      containerStyle={[block && styles.block, containerStyle]}
      style={({ pressed }) => [styles.base, buttonHeightStyle(height), background(pressed)]}>
      <View style={styles.row}>
        {loading && <ActivityIndicator color={colors[foreground]} />}
        {!loading && Icon && <Icon size={BUTTON_ICON_SIZE} color={colors[foreground]} strokeWidth={1.8} />}
        <Text variant="button" tone={foreground}>
          {text}
        </Text>
      </View>
    </PressableScale>
  );
}

export default Button;
