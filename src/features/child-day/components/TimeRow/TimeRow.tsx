import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { useTimeRowStyles } from './TimeRow.styles';

interface TimeRowProps {
  time?: string;
  label: string;
  divided: boolean;
  detail?: ReactNode;
  aside?: ReactNode;
}

/** Design F6: an entry with a time leads with it in full ink, then what, then how much; meals have no time (Seba, change 481a4527). */
export function TimeRow({ time, label, divided, detail, aside }: TimeRowProps) {
  const styles = useTimeRowStyles();
  return (
    <View style={[styles.row, divided && styles.divided]} accessible>
      {time ? (
        <Text numeric style={styles.time}>
          {time}
        </Text>
      ) : null}
      <View style={styles.label}>
        <Text variant="bodyStrong">{label}</Text>
        {detail}
      </View>
      {aside}
    </View>
  );
}
