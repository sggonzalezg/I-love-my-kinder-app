import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { NewChildChoice } from '@/lib/new-child-form';

import { styles, useRoomChoiceChipsStyles } from './RoomChoiceChips.styles';

interface RoomChoiceChipsProps {
  label: string;
  choices: NewChildChoice[];
  value: string | null;
  error: string | null;
  disabled: boolean;
  onChange: (value: string) => void;
}

export function RoomChoiceChips({ label, choices, value, error, disabled, onChange }: RoomChoiceChipsProps) {
  const themed = useRoomChoiceChipsStyles();
  return (
    <View style={styles.field}>
      <Text variant="label">{label}</Text>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {choices.map((choice) => {
          const selected = choice.value === value;
          return (
            <PressableScale
              key={choice.value}
              haptic="selection"
              disabled={disabled}
              onPress={() => onChange(choice.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled }}
              style={[styles.chip, selected ? themed.selected : themed.idle, error && !selected ? themed.error : null]}>
              <Text variant="smallStrong" tone={selected ? 'onBlue' : 'ink'}>
                {choice.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
      {error ? (
        <Text variant="small" tone="red">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
