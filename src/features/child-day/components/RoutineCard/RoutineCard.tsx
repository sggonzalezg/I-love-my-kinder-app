import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './RoutineCard.styles';

interface RoutineCardProps {
  icon: ReactNode;
  title: string;
  aside?: string;
  children: ReactNode;
}

export function RoutineCard({ icon, title, aside, children }: RoutineCardProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.card, backgroundStyles.surface]}>
      <View style={styles.header}>
        {icon}
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {aside ? (
          <Text variant="small" tone="muted" numeric>
            {aside}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
