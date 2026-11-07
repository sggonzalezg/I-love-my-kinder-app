import { View } from 'react-native';

import { Text } from '@/components/text';
import { formatHistoryMoment, type HistoryEntry } from '@/lib/outing-permission';
import { PERMISSION_COPY } from './outing-permission-copy';
import { styles } from './permission-history.styles';

interface PermissionHistoryProps {
  entries: HistoryEntry[];
}

export function PermissionHistory({ entries }: PermissionHistoryProps) {
  return (
    <View style={styles.history}>
      <Text variant="section" accessibilityRole="header">
        {PERMISSION_COPY.history}
      </Text>
      {entries.map((entry) => (
        <View key={`${entry.at}-${entry.text}`} style={styles.row}>
          <Text variant="small" color="muted" numeric style={styles.moment}>
            {formatHistoryMoment(entry.at)}
          </Text>
          <Text variant="small" style={styles.text}>
            {entry.text}
          </Text>
        </View>
      ))}
    </View>
  );
}
