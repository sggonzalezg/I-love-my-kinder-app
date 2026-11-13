import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/text';

import { useTimeRowStyles } from './TimeRow.styles';

interface TimeRowProps {
  time: string;
  label: string;
  divided: boolean;
  detail?: ReactNode;
  aside?: ReactNode;
}

/** Design F6: every entry leads with its time in full ink, then what, then how much. */
export function TimeRow({ time, label, divided, detail, aside }: TimeRowProps) {
  const styles = useTimeRowStyles();
  return (
    <View style={[styles.row, divided && styles.divided]} accessible>
      <Text numeric style={styles.time}>
        {time}
      </Text>
      <View style={styles.label}>
        <Text variant="bodyStrong">{label}</Text>
        {detail}
      </View>
      {aside}
    </View>
  );
}
