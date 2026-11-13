import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';

import { styles } from './DayCompactHeader.styles';

interface DayCompactHeaderProps {
  photoPath: string | null;
  initials: string;
  firstName: string;
  leading: ReactNode;
  trailing: ReactNode;
}

export function DayCompactHeader({ photoPath, initials, firstName, leading, trailing }: DayCompactHeaderProps) {
  return (
    <View style={styles.bar}>
      {leading}
      <Avatar photoPath={photoPath} initials={initials} />
      <Text variant="title" accessibilityRole="header" numberOfLines={1} style={styles.name}>
        {firstName}
      </Text>
      {trailing}
    </View>
  );
}
