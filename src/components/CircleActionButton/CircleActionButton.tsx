import type { LucideIcon } from 'lucide-react-native';

import { PressableScale } from '@/components/pressable-scale';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CIRCLE_ACTION_ICON_SIZE, styles } from './CircleActionButton.styles';

interface CircleActionButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

export function CircleActionButton({ icon: Icon, label, onPress }: CircleActionButtonProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed ? backgroundStyles.blue100 : backgroundStyles.blue50]}>
      <Icon size={CIRCLE_ACTION_ICON_SIZE} color={colors.blue} strokeWidth={1.8} />
    </PressableScale>
  );
}
