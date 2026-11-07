import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHIP_ICON_SIZE, CHIP_PALETTES, styles, type ChipVariant } from './chip.styles';
import { Text } from './text';

export type { ChipVariant };

export function Chip({ label, icon: Icon, variant = 'blue' }: { label: string; icon?: LucideIcon; variant?: ChipVariant }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const { background, foreground } = CHIP_PALETTES[variant];
  return (
    <View style={[styles.chip, backgroundStyles[background]]}>
      {Icon && <Icon size={CHIP_ICON_SIZE} color={colors[foreground]} strokeWidth={1.8} />}
      <Text variant="caption" tone={foreground} style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
