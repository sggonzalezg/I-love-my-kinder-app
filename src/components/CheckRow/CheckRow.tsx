import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { CHECK_ICON_SIZE, styles, useCheckRowStyles } from './CheckRow.styles';

interface CheckRowProps {
  label: string;
  detail?: string | null;
  checked: boolean;
  separated: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function CheckRow({ label, detail, checked, separated, disabled, onToggle }: CheckRowProps) {
  const colors = useColors();
  const themed = useCheckRowStyles();

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onToggle();
      }}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      accessibilityLabel={detail ? `${label}, ${detail}` : label}
      style={({ pressed }) => [styles.row, separated && styles.separated, pressed ? themed.rowPressed : themed.row]}>
      <View style={[styles.box, checked ? themed.boxOn : themed.boxOff]}>{checked ? <Check size={CHECK_ICON_SIZE} color={colors.onBlue} strokeWidth={2.6} /> : null}</View>
      <View style={styles.label}>
        <Text>{label}</Text>
        {detail ? (
          <Text variant="small" tone="muted">
            {detail}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
