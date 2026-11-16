import type { LucideIcon } from 'lucide-react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { iconStroke, type ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { ANSWER_ICON_SIZE, fillTransition, styles, useAnswerOptionColorStyles, type SelectedFill } from './AnswerOption.styles';

interface AnswerOptionProps {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  selectedFill: SelectedFill;
  selectedTone: ColorName;
  disabled: boolean;
  onPress: () => void;
}

export function AnswerOption({ label, icon: Icon, selected, selectedFill, selectedTone, disabled, onPress }: AnswerOptionProps) {
  const colors = useColors();
  const colorStyles = useAnswerOptionColorStyles();
  const reduced = useReducedMotion();
  const tone = selected ? selectedTone : 'ink';

  return (
    <PressableScale
      containerStyle={styles.option}
      haptic="selection"
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}>
      <Animated.View style={[styles.pill, selected ? colorStyles[selectedFill] : colorStyles.idle, !reduced && fillTransition]}>
        {selected && <Icon size={ANSWER_ICON_SIZE} color={colors[tone]} strokeWidth={iconStroke.bold} />}
        <Text variant="label" tone={tone}>
          {label}
        </Text>
      </Animated.View>
    </PressableScale>
  );
}
