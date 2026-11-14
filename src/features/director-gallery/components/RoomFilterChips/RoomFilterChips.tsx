import { ScrollView } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { DIRECTOR_GALLERY_COPY } from '@/features/director-gallery/director-gallery-copy';
import type { RoomChip } from '@/lib/director-gallery';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './RoomFilterChips.styles';

interface RoomFilterChipsProps {
  chips: RoomChip[];
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function RoomFilterChips({ chips, selectedKey, onSelect }: RoomFilterChipsProps) {
  const backgroundStyles = useBackgroundColorStyles();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel={DIRECTOR_GALLERY_COPY.roomFilter}>
      {chips.map((chip) => {
        const selected = chip.key === selectedKey;
        return (
          <PressableScale
            key={chip.key}
            haptic="selection"
            onPress={() => onSelect(chip.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.chip, selected ? backgroundStyles.blue : backgroundStyles.surface]}>
            <Text variant="smallStrong" tone={selected ? 'onBlue' : 'ink'}>
              {chip.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
