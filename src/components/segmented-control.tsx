import type { LucideIcon } from 'lucide-react-native';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';

const OPTION_ICON_SIZE = 14;

interface Option {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceVariant,
          borderRadius: radius.md,
          padding: spacing.xs,
          gap: spacing.xs,
        },
      ]}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const OptionIcon = option.icon;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? colors.primary : 'transparent',
                borderRadius: radius.sm,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            {OptionIcon ? <OptionIcon size={OPTION_ICON_SIZE} color={isSelected ? colors.onPrimary : colors.onSurface} /> : null}
            <Text
              style={{
                color: isSelected ? colors.onPrimary : colors.onSurface,
                fontWeight: isSelected ? '600' : '500',
                fontSize: 14,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
