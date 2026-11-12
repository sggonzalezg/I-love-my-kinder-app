import { Check, CircleAlert, Clock, type LucideIcon } from 'lucide-react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { Text } from '@/components/text';
import { SYNC_CHIP_LABELS } from '@/features/teacher-day/teacher-day-copy';
import type { ChildSyncStatus } from '@/lib/routine-queue';
import { duration, easeOut } from '@/theme/motion';
import type { ColorName } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { SYNC_ICON_SIZE, styles } from './SyncChip.styles';

type ShownStatus = Exclude<ChildSyncStatus, 'none'>;

const LOOK: Record<ShownStatus, { icon: LucideIcon; tone: ColorName }> = {
  synced: { icon: Check, tone: 'ok' },
  pending: { icon: Clock, tone: 'wait' },
  rejected: { icon: CircleAlert, tone: 'red' },
};

const STATUS_CHANGE = FadeIn.duration(duration.base).easing(easeOut).reduceMotion(ReduceMotion.System);

export function SyncChip({ status }: { status: ChildSyncStatus }) {
  const colors = useColors();
  if (status === 'none') return null;
  const { icon: Icon, tone } = LOOK[status];
  return (
    <Animated.View key={status} entering={STATUS_CHANGE} style={styles.chip} accessibilityLiveRegion="polite">
      <Icon size={SYNC_ICON_SIZE} color={colors[tone]} strokeWidth={1.8} />
      <Text tone={tone} style={styles.label}>
        {SYNC_CHIP_LABELS[status]}
      </Text>
    </Animated.View>
  );
}
