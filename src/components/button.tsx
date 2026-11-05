import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

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
  const c = useColors();
  const text = label || title || '';

  // Map 'secondary' to 'soft'
  const actualVariant = variant === 'secondary' ? 'soft' : variant;

  const palette = {
    primary: { bg: c.blue, pressed: c.bluePress, fg: c.onBlue },
    soft: { bg: c.blue50, pressed: c.blue100, fg: c.blue },
    plain: { bg: c.surface, pressed: c.raised, fg: c.ink },
    danger: { bg: c.red, pressed: c.red, fg: c.onRed },
    'danger-soft': { bg: c.red50, pressed: c.red50, fg: c.red },
    ghost: { bg: 'transparent', pressed: c.raised, fg: c.blue },
  }[actualVariant];
  const off = disabled || loading;
  const fg = disabled ? c.muted : palette.fg;
  const background = (pressed: boolean) => {
    if (disabled) return c.raised;
    return pressed ? palette.pressed : palette.bg;
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
      style={({ pressed }) => [
        styles.base,
        { minHeight: height, backgroundColor: background(pressed) },
      ]}>
      <View style={styles.row}>
        {loading && <ActivityIndicator color={fg} />}
        {!loading && Icon && <Icon size={20} color={fg} strokeWidth={1.8} />}
        <Text variant="button" style={{ color: fg }}>
          {text}
        </Text>
      </View>
    </PressableScale>
  );
}

export default Button;

const styles = StyleSheet.create({
  base: { borderRadius: radius.full, paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
