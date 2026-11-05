import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { radius, size } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { PressableScale } from './pressable-scale';
import { Text } from './text';

export type ButtonVariant = 'primary' | 'soft' | 'plain' | 'danger' | 'danger-soft' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  /** 52 default, 60 for the teacher action bar, 44 small. */
  height?: number;
  accessibilityHint?: string;
};

/** design.md section 6 Button: pill, label DM Sans 700 16; disabled is raised/muted, never just faded. */
export function Button({ label, onPress, variant = 'primary', icon: Icon, disabled, loading, block, height = size.button, accessibilityHint }: Props) {
  const c = useColors();
  const palette = {
    primary: { bg: c.blue, pressed: c.bluePress, fg: c.onBlue },
    soft: { bg: c.blue50, pressed: c.blue100, fg: c.blue },
    plain: { bg: c.surface, pressed: c.raised, fg: c.ink },
    danger: { bg: c.red, pressed: c.red, fg: c.onRed },
    'danger-soft': { bg: c.red50, pressed: c.red50, fg: c.red },
    ghost: { bg: 'transparent', pressed: c.raised, fg: c.blue },
  }[variant];
  const off = disabled || loading;
  const fg = disabled ? c.muted : palette.fg;

  return (
    <PressableScale
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      containerStyle={block && styles.block}
      style={({ pressed }) => [
        styles.base,
        { minHeight: height, backgroundColor: disabled ? c.raised : pressed ? palette.pressed : palette.bg },
      ]}>
      <View style={styles.row}>
        {loading ? <ActivityIndicator color={fg} /> : Icon ? <Icon size={20} color={fg} strokeWidth={1.8} /> : null}
        <Text variant="button" style={{ color: fg }}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.full, paddingHorizontal: 22, justifyContent: 'center', alignItems: 'center' },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
