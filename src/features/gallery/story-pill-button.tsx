import type { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';

import { PILL_FOREGROUND, PILL_ICON_SIZE, styles } from './story-pill-button.styles';

interface StoryPillButtonProps {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  iconAfter?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function StoryPillButton({ label, onPress, icon: Icon, iconAfter = false, loading = false, disabled = false }: StoryPillButtonProps) {
  const icon = loading ? <ActivityIndicator color={PILL_FOREGROUND} /> : Icon ? <Icon size={PILL_ICON_SIZE} color={PILL_FOREGROUND} strokeWidth={2} /> : null;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
      style={({ pressed }) => [styles.pill, pressed && styles.pressed]}>
      {iconAfter ? null : icon}
      <Text variant="button" style={styles.label}>
        {label}
      </Text>
      {iconAfter ? icon : null}
    </PressableScale>
  );
}
