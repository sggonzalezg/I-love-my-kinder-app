import { View } from 'react-native';
import { Text } from './text';
import { useTheme } from '@/theme/use-theme';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: colors.onSurface,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: spacing.sm,
        }}
      >
        {description}
      </Text>
    </View>
  );
}
