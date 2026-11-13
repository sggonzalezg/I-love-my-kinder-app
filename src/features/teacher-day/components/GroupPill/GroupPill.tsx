import { View } from 'react-native';

import { Text } from '@/components/text';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './GroupPill.styles';

/** A teacher with one group sees it as a plain pill; two or more get the room switch Select. */
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
