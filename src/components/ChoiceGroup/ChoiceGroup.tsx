import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';

import { CHOICE_PRESSED_SCALE, styles, useChoiceGroupStyles } from './ChoiceGroup.styles';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

interface ChoiceGroupProps<T extends string> {
  label: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function ChoiceGroup<T extends string>({ label, options, value, onChange, disabled }: ChoiceGroupProps<T>) {
  const themed = useChoiceGroupStyles();
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            pressedScale={CHOICE_PRESSED_SCALE}
            containerStyle={styles.cell}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled: !!disabled }}
            onPress={() => {
              if (selected) return;
              Haptics.selectionAsync();
              onChange(option.value);
            }}
            style={[styles.choice, selected ? themed.selected : themed.idle]}>
            <Text style={[styles.label, selected ? themed.selectedLabel : themed.idleLabel]}>{option.label}</Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
