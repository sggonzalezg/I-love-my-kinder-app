import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHIP_ICON_SIZE, CHIP_PALETTES, COMPACT_CHIP_ICON_SIZE, styles, type ChipVariant } from './chip.styles';
import { Text } from './text';

export type { ChipVariant };

export function Chip({ label, icon: Icon, variant = 'blue', compact = false }: { label: string; icon?: LucideIcon; variant?: ChipVariant; compact?: boolean }) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const { background, foreground } = CHIP_PALETTES[variant];
  return (
    <View style={[styles.chip, compact && styles.compact, backgroundStyles[background]]}>
      {Icon && <Icon size={compact ? COMPACT_CHIP_ICON_SIZE : CHIP_ICON_SIZE} color={colors[foreground]} strokeWidth={1.8} />}
      <Text variant="caption" tone={foreground} style={[styles.label, compact && styles.compactLabel]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
