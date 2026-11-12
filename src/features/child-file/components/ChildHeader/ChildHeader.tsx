import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { initials } from '@/lib/format';

import { styles } from './ChildHeader.styles';

interface ChildHeaderProps {
  firstName: string;
  lastName: string;
  photoPath: string | null;
  subtitle: string;
}

export function ChildHeader({ firstName, lastName, photoPath, subtitle }: ChildHeaderProps) {
  return (
    <View style={styles.header}>
      <Avatar photoPath={photoPath} initials={initials(firstName, lastName)} size="xl" />
      <View style={styles.text}>
        <Text variant="title" accessibilityRole="header">
          {`${firstName} ${lastName}`.trim()}
        </Text>
        <Text variant="small" tone="muted">
          {subtitle}
        </Text>
      </View>
    </View>
  );
}
