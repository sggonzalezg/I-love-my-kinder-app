import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { styles } from './FieldLabel.styles';

interface FieldLabelProps {
  title: string;
  /** A muted note on the right ("9:00", "opcional"), or an action. */
  aside?: ReactNode;
}

export function FieldLabel({ title, aside }: FieldLabelProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {typeof aside === 'string' ? (
        <Text variant="small" tone="muted" numeric>
          {aside}
        </Text>
      ) : (
        aside
      )}
    </View>
  );
}
