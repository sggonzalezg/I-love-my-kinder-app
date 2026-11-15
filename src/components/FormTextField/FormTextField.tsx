import { TextInput, View } from 'react-native';

import { Text } from '@/components/text';
import { useColors } from '@/theme/use-theme';

import { styles, useFormTextFieldStyles } from './FormTextField.styles';

interface FormTextFieldProps {
  label: string;
  labelAside?: string;
  help?: string;
  value: string;
  multiline?: boolean;
  editable: boolean;
  maxLength: number;
  onChange: (text: string) => void;
}

export function FormTextField({ label, labelAside, help, value, multiline = false, editable, maxLength, onChange }: FormTextFieldProps) {
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
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={multiline}
        maxLength={maxLength}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, multiline && styles.multiline, themed.input]}
      />
      {help ? (
        <Text variant="small" tone="muted">
          {help}
        </Text>
      ) : null}
    </View>
  );
}
