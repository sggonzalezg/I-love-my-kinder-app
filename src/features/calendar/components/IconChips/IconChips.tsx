import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { CHIP_ICON_SIZE, CHIP_PRESSED_SCALE, styles, useIconChipsStyles } from './IconChips.styles';

export interface IconChipOption<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface IconChipsProps<T extends string> {
  label: string;
  options: IconChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

export function IconChips<T extends string>({ label, options, value, onChange }: IconChipsProps<T>) {
  const colors = useColors();
  const themed = useIconChipsStyles();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value;
        const Icon = option.icon;
        return (
          <PressableScale
            key={option.value}
            pressedScale={CHIP_PRESSED_SCALE}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync();
              onChange(option.value);
            }}
            style={[styles.chip, selected ? themed.selected : themed.idle]}>
            <Icon size={CHIP_ICON_SIZE} color={selected ? colors.onBlue : colors.ink} />
            <Text variant="smallStrong" tone={selected ? 'onBlue' : 'ink'}>
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
