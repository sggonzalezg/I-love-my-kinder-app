import { ScrollView } from 'react-native';

import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';
import { CHILD_DAY_COPY } from '@/features/child-day/child-day-copy';
import type { StripDay } from '@/lib/child-day';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './DayStrip.styles';

interface DayStripProps {
  days: StripDay[];
  selectedIsoDate: string;
  onChoose: (isoDate: string) => void;
}

export function DayStrip({ days, selectedIsoDate, onChoose }: DayStripProps) {
  const backgroundStyles = useBackgroundColorStyles();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strip} contentContainerStyle={styles.content} accessibilityLabel={CHILD_DAY_COPY.days}>
      {days.map((day) => {
        const selected = day.isoDate === selectedIsoDate;
        return (
          <PressableScale
            key={day.isoDate}
            haptic="selection"
            onPress={() => onChoose(day.isoDate)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[styles.chip, selected ? backgroundStyles.blue : backgroundStyles.surface]}>
            <Text variant="small" tone={selected ? 'onBlue' : 'ink'} numeric style={styles.label}>
              {day.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}
