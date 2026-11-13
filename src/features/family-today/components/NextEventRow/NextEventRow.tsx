import { ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import type { NextEvent } from '@/data/family-today';
import { MONTHS_SHORT } from '@/lib/dates';
import { nextEventLine } from '@/lib/family-today';
import { useBackgroundColorStyles } from '@/theme/color-styles';
import { useColors } from '@/theme/use-theme';

import { CHEVRON_SIZE, NEXT_EVENT_PRESSED_SCALE, styles } from './NextEventRow.styles';

interface NextEventRowProps {
  event: NextEvent;
  onPress: () => void;
}

export function NextEventRow({ event, onPress }: NextEventRowProps) {
  const colors = useColors();
  const backgroundStyles = useBackgroundColorStyles();
  const startsAt = new Date(event.startsAt);
  const line = nextEventLine(event);

  return (
    <PressableScale
      onPress={onPress}
      pressedScale={NEXT_EVENT_PRESSED_SCALE}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${line}`}
      style={[styles.row, backgroundStyles.surface]}>
      <View style={[styles.dateTile, backgroundStyles.blue50]}>
        <Text tone="blue" numeric style={styles.dateTileDay}>
          {startsAt.getDate()}
        </Text>
        <Text tone="blue" style={styles.dateTileMonth}>
          {MONTHS_SHORT[startsAt.getMonth()]}
        </Text>
      </View>
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {event.title}
        </Text>
        <Text variant="small" tone="muted">
          {line}
        </Text>
      </View>
      <ChevronRight size={CHEVRON_SIZE} color={colors.muted} strokeWidth={1.8} />
    </PressableScale>
  );
}
