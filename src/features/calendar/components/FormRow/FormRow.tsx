import { Pressable, View } from 'react-native';

import { Switch } from '@/components/switch';
import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './FormRow.styles';

interface FormRowProps {
  label: string;
  labelAside?: string;
  caption?: string;
  value?: string;
  error?: boolean;
  onPress?: () => void;
  switchValue?: boolean;
  switchDisabled?: boolean;
  onSwitchChange?: (next: boolean) => void;
}

export function FormRow({ label, labelAside, caption, value, error = false, onPress, switchValue, switchDisabled, onSwitchChange }: FormRowProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={styles.row}>
      <View style={styles.key}>
        <Text variant="bodyStrong">
          {label}
          {labelAside ? (
            <Text variant="small" tone="muted">
              {` ${labelAside}`}
            </Text>
          ) : null}
        </Text>
        {caption ? (
          <Text variant="small" tone="muted">
            {caption}
          </Text>
        ) : null}
      </View>
      {value !== undefined ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${value}`}
          style={[styles.pill, error ? backgroundStyles.red50 : backgroundStyles.blue50]}>
          <Text variant="bodyStrong" numeric tone={error ? 'red' : 'blue'}>
            {value}
          </Text>
        </Pressable>
      ) : null}
      {switchValue !== undefined && onSwitchChange ? (
        <Switch value={switchValue} onChange={onSwitchChange} label={label} disabled={switchDisabled} />
      ) : null}
    </View>
  );
}
