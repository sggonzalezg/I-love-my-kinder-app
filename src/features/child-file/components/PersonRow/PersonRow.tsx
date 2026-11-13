import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { styles } from './PersonRow.styles';

interface PersonRowProps {
  name: string;
  detail: string;
  action: ReactNode;
}

export function PersonRow({ name, detail, action }: PersonRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        {detail ? (
          <Text variant="small" tone="muted" numeric>
            {detail}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
