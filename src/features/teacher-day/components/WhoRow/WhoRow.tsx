import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { IconButton } from '@/components/icon-button';
import { RollingNumber } from '@/components/RollingNumber/RollingNumber';
import { Text } from '@/components/text';
import { SyncChip } from '@/features/teacher-day/components/SyncChip/SyncChip';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import type { ChildSyncStatus } from '@/lib/routine-queue';

import { styles } from './WhoRow.styles';

interface WhoRowProps {
  name: string;
  /** "8" of "8 de 15", rolled on change; null when the line is `meta` alone. */
  position: number | null;
  meta: string;
  status: ChildSyncStatus;
}

export function WhoRow({ name, position, meta, status }: WhoRowProps) {
  return (
    <View style={styles.row}>
      <IconButton icon={ChevronLeft} label={TEACHER_DAY_COPY.back} onPress={() => router.back()} />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1} accessibilityRole="header">
          {name}
        </Text>
        <View style={styles.meta}>
          {position !== null ? <RollingNumber value={position} tone="muted" style={styles.metaText} /> : null}
          <Text numeric tone="muted" style={styles.metaText} numberOfLines={1}>
            {position !== null ? ` ${meta}` : meta}
          </Text>
        </View>
      </View>
      <SyncChip status={status} />
    </View>
  );
}
