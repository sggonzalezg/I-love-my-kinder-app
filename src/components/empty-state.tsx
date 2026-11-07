import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';

import { styles } from './empty-state.styles';
import { Text } from './text';

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: ImageSource;
}

export function EmptyState({ title, description, illustration }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {illustration ? <Image source={illustration} style={styles.illustration} contentFit="cover" accessible={false} /> : null}
      <Text tone="ink" style={styles.title}>
        {title}
      </Text>
      <Text tone="muted" style={styles.description}>
        {description}
      </Text>
    </View>
  );
}
