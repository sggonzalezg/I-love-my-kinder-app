import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { CHECK_ICON_SIZE, styles, useGroupCheckRowStyles } from './GroupCheckRow.styles';

interface GroupCheckRowProps {
  label: string;
  checked: boolean;
  separated: boolean;
  onToggle: () => void;
}

export function GroupCheckRow({ label, checked, separated, onToggle }: GroupCheckRowProps) {
  const colors = useColors();
  const themed = useGroupCheckRowStyles();

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onToggle();
      }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, separated && styles.separated, pressed ? themed.rowPressed : themed.row]}>
      <View style={[styles.box, checked ? themed.boxOn : themed.boxOff]}>{checked ? <Check size={CHECK_ICON_SIZE} color={colors.onBlue} strokeWidth={2.6} /> : null}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
