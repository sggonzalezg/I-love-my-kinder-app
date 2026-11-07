import { View } from 'react-native';

import { styles } from './empty-state.styles';
import { Text } from './text';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text tone="ink" style={styles.title}>
        {title}
      </Text>
      <Text tone="muted" style={styles.description}>
        {description}
      </Text>
    </View>
  );
}
