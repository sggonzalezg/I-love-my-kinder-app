import { ScrollView } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { DIRECTOR_CHILDREN_COPY } from '@/features/director-children/director-children-copy';
import { type ChildFilePart } from '@/lib/director-child-file';

import { styles, useFilePartChipsStyles } from './FilePartChips.styles';

interface FilePartChipsProps {
  parts: readonly ChildFilePart[];
  value: ChildFilePart;
  disabled: boolean;
  onChange: (part: ChildFilePart) => void;
}

export function FilePartChips({ parts, value, disabled, onChange }: FilePartChipsProps) {
  const themed = useFilePartChipsStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
      accessibilityLabel={DIRECTOR_CHILDREN_COPY.filePartsLabel}>
      {parts.map((part) => {
        const selected = part === value;
        return (
          <PressableScale
            key={part}
            haptic="selection"
            disabled={disabled}
            onPress={() => onChange(part)}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            style={[styles.chip, selected ? themed.selected : themed.idle]}>
            <Text variant="smallStrong" tone={selected ? 'onBlue' : 'ink'}>
              {DIRECTOR_CHILDREN_COPY.fileParts[part]}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
