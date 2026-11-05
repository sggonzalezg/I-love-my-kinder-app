import { Pressable, View } from 'react-native';
import { useColors } from '@/theme/use-theme';
import { space, radius, type as typeScale } from '@/theme/tokens';
import Text from './text';

interface ConsentCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: React.ReactNode;
  disabled?: boolean;
}

export default function ConsentCheckbox({ checked, onPress, label, disabled = false }: ConsentCheckboxProps) {
  const c = useColors();

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.5 : 1 }}>
      <View style={{ flexDirection: 'row', gap: space.s3, alignItems: 'flex-start' }}>
        <View
          style={{
            width: 24,
            height: 24,
            marginTop: 2,
            borderWidth: 2,
            borderColor: checked ? c.blue : c.border,
            borderRadius: radius.sm,
            backgroundColor: checked ? c.blue : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {checked && (
            <Text
              style={{
                color: c.ground,
                fontSize: 16,
                fontWeight: '700',
                marginTop: -2,
              }}
            >
              ✓
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>{label}</View>
      </View>
    </Pressable>
  );
}
