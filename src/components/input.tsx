import { TextInput, View, ViewStyle } from 'react-native';
import { useColors } from '@/theme/use-theme';
import { space, size, type as typeScale, radius } from '@/theme/tokens';
import Text from './text';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  editable?: boolean;
  autoComplete?: any;
  textContentType?: 'oneTimeCode' | 'telephoneNumber' | 'emailAddress' | 'password';
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'phone-pad' | 'email-address' | 'url' | 'ascii-capable';
  secureTextEntry?: boolean;
  maxLength?: number;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  error,
  editable = true,
  autoComplete,
  textContentType,
  keyboardType = 'default',
  secureTextEntry,
  maxLength,
  accessibilityLabel,
  style,
}: InputProps) {
  const c = useColors();
  const hasError = !!error && value.length > 0;

  return (
    <View style={style}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
        autoComplete={autoComplete}
        textContentType={textContentType}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        accessibilityLabel={accessibilityLabel}
        placeholderTextColor={c.muted}
        style={[
          {
            height: size.input,
            paddingHorizontal: space.s3,
            paddingVertical: space.s2,
            borderWidth: 1,
            borderColor: hasError ? c.red : c.border,
            borderRadius: radius.md,
            backgroundColor: c.surface,
            color: c.ink,
            ...typeScale.body,
          },
        ]}
      />
      {hasError && (
        <Text variant="small" color="red" style={{ marginTop: space.s2 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
