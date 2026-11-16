import { TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';

import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { styles, useFormTextFieldStyles } from './FormTextField.styles';

type TextEntryProps = Pick<TextInputProps, 'placeholder' | 'autoComplete' | 'textContentType' | 'autoCapitalize' | 'autoCorrect' | 'returnKeyType' | 'onSubmitEditing'>;

interface FormTextFieldProps {
  label: string;
  labelAside?: string;
  help?: string;
  /** Shown instead of the help, in red, with a red border. */
  error?: string | null;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  multiline?: boolean;
  editable: boolean;
  maxLength: number;
  onChange: (text: string) => void;
  textEntry?: TextEntryProps;
}

export function FormTextField({ label, labelAside, help, error, keyboardType, value, multiline = false, editable, maxLength, onChange, textEntry }: FormTextFieldProps) {
  const colors = useColors();
  const themed = useFormTextFieldStyles();
  return (
    <View style={styles.field}>
      <Text variant="label">
        {label}
        {labelAside ? (
          <Text variant="small" tone="muted">
            {` ${labelAside}`}
          </Text>
        ) : null}
      </Text>
      <TextInput
        {...textEntry}
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.multiline, themed.input, error ? themed.inputError : null]}
      />
      {error ? (
        <Text variant="small" tone="red" accessibilityRole="alert">
          {error}
        </Text>
      ) : help ? (
        <Text variant="small" tone="muted">
          {help}
        </Text>
      ) : null}
    </View>
  );
}
