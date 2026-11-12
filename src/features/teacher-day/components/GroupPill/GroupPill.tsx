import { View } from 'react-native';

import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './GroupPill.styles';

/** The group label in the room-switch pill; picking another group comes with the shared Select (step SEL). */
export function GroupPill({ label }: { label: string }) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <View style={[styles.pill, backgroundStyles.blue50]} accessibilityRole="header">
      <Text tone="blue" style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
