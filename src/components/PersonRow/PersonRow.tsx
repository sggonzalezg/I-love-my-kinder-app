import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { styles } from './PersonRow.styles';

interface PersonRowProps {
  name: string;
  detail: string;
  secondDetail?: string | null;
  action: ReactNode;
}

export function PersonRow({ name, detail, secondDetail, action }: PersonRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        {[detail, secondDetail].filter(Boolean).map((line) => (
          <Text key={line} variant="small" tone="muted" numeric>
            {line}
          </Text>
        ))}
      </View>
      {action}
    </View>
  );
}
