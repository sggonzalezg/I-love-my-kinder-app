import { ScrollView } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { OUTING_PERMISSIONS_COPY } from '@/features/outing-permissions/outing-permissions-copy';
import type { PermissionFilter } from '@/lib/outing-permissions';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './PermissionFilterChips.styles';

interface PermissionFilterChipsProps {
  chips: { key: PermissionFilter; label: string }[];
  selected: PermissionFilter;
  onSelect: (filter: PermissionFilter) => void;
}

export function PermissionFilterChips({ chips, selected, onSelect }: PermissionFilterChipsProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={OUTING_PERMISSIONS_COPY.filters}>
      {chips.map((chip) => {
        const isSelected = chip.key === selected;
        return (
          <PressableScale
            key={chip.key}
            haptic="selection"
            onPress={() => onSelect(chip.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            style={[styles.chip, backgroundStyles[isSelected ? 'blue' : 'surface']]}>
            <Text variant="smallStrong" tone={isSelected ? 'onBlue' : 'ink'} numeric>
              {chip.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
