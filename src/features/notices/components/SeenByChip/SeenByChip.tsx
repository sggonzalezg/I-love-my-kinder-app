import { CheckCheck } from 'lucide-react-native';

import { Chip } from '@/components/chip';
import { PressableScale } from '@/components/pressable-scale';
import { NOTICES_COPY } from '@/features/notices/notices-copy';
import { seenByLabel, type SeenSummary } from '@/lib/notices';

import { styles } from './SeenByChip.styles';

interface SeenByChipProps {
  summary: SeenSummary;
  /** Without it the chip is a plain label (inside a pressable row). */
  onPress?: () => void;
}

export function SeenByChip({ summary, onPress }: SeenByChipProps) {
  const label = seenByLabel(summary);
  if (!onPress) return <Chip label={label} icon={CheckCheck} variant="ok" compact />;
  return (
    <PressableScale
      onPress={onPress}
      haptic="light"
      containerStyle={styles.button}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={NOTICES_COPY.seenSheetHint}>
      <Chip label={label} icon={CheckCheck} variant="ok" />
    </PressableScale>
  );
}
