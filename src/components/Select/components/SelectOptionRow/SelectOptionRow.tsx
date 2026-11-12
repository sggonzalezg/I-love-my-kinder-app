import { Image } from 'expo-image';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { SelectOption } from '@/components/Select/select-reducer';
import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { CHECK_SIZE, styles, useRowColorStyles } from './SelectOptionRow.styles';

interface SelectOptionRowProps {
  option: SelectOption;
  selected: boolean;
  onChoose: (option: SelectOption) => void;
}

export function SelectOptionRow({ option, selected, onChoose }: SelectOptionRowProps) {
  const colors = useColors();
  const rowColorStyles = useRowColorStyles();
  const disabled = !!option.disabledReason;
  const secondLine = option.disabledReason ?? option.description;
  const labelTone = disabled ? 'muted' : selected ? 'blue' : 'ink';

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChoose(option)}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [styles.row, selected ? rowColorStyles.selected : pressed ? rowColorStyles.pressed : rowColorStyles.idle]}>
      {option.imageUrl ? <Image source={{ uri: option.imageUrl }} style={styles.photo} accessibilityIgnoresInvertColors /> : null}
      <View style={styles.texts}>
        <Text variant="option" tone={labelTone} style={selected && styles.selectedLabel} numberOfLines={1}>
          {option.label}
        </Text>
        {secondLine ? (
          <Text variant="small" tone="muted" numberOfLines={1}>
            {secondLine}
          </Text>
        ) : null}
      </View>
      <View style={styles.check}>{selected ? <Check size={CHECK_SIZE} color={colors.blue} strokeWidth={2} /> : null}</View>
    </Pressable>
  );
}
