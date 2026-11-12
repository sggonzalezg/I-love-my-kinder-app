import { Check, CircleAlert, Clock, Pencil, type LucideIcon } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Text } from '@/components/text';
import { SYNC_STATUS_LABELS, TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { initials } from '@/lib/format';
import type { ChildSyncStatus } from '@/lib/routine-queue';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { ALLERGY_ICON_SIZE, STATUS_ICON_SIZE, STATUS_PALETTES, styles } from './ChildStatusRow.styles';

const STATUS_ICONS: Record<ChildSyncStatus, LucideIcon> = { none: Pencil, synced: Check, pending: Clock, rejected: CircleAlert };

interface ChildStatusRowProps {
  name: string;
  photoPath: string | null;
  hasAllergy: boolean;
  status: ChildSyncStatus;
  onPress: () => void;
}

export function ChildStatusRow({ name, photoPath, hasAllergy, status, onPress }: ChildStatusRowProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const palette = STATUS_PALETTES[status];
  const StatusIcon = STATUS_ICONS[status];
  const [firstName, ...lastNames] = name.split(' ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${SYNC_STATUS_LABELS[status]}${hasAllergy ? `, ${TEACHER_DAY_COPY.allergy}` : ''}`}
      style={({ pressed }) => [styles.row, pressed ? backgroundStyles.raised : backgroundStyles.surface]}>
      <Avatar photoPath={photoPath} initials={initials(firstName, lastNames.join(' '))} />
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {name}
        </Text>
        {hasAllergy ? (
          <View style={styles.allergy}>
            <CircleAlert size={ALLERGY_ICON_SIZE} color={colors.red} strokeWidth={1.8} />
            <Text variant="small" tone="red">
              {TEACHER_DAY_COPY.allergy}
            </Text>
          </View>
        ) : (
          <Text variant="small" tone="muted">
            {SYNC_STATUS_LABELS[status]}
          </Text>
        )}
      </View>
      <View style={[styles.statusIcon, backgroundStyles[palette.background]]}>
        <StatusIcon size={STATUS_ICON_SIZE} color={colors[palette.foreground]} strokeWidth={1.8} />
      </View>
    </Pressable>
  );
}
