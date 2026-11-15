import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { DIRECTOR_SETTINGS_COPY } from '@/features/director-settings/director-settings-copy';
import { formatDbTime } from '@/lib/dates';
import type { SettingsShift, ShiftTimeEdge } from '@/lib/director-settings';
import { shiftLabel } from '@/lib/shift';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './ShiftTimesRow.styles';

interface ShiftTimesRowProps {
  shift: SettingsShift;
  invalid: boolean;
  disabled: boolean;
  onTimePress: (edge: ShiftTimeEdge) => void;
}

export function ShiftTimesRow({ shift, invalid, disabled, onTimePress }: ShiftTimesRowProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const label = shiftLabel(shift.name);
  const shiftName = label.toLowerCase();

  const timePill = (edge: ShiftTimeEdge, accessibilityName: string) => {
    const time = formatDbTime(shift[edge]);
    return (
      <Pressable
        onPress={() => onTimePress(edge)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityName}: ${time}`}
        style={({ pressed }) => [styles.pill, invalid ? backgroundStyles.red50 : pressed ? backgroundStyles.raised : backgroundStyles.blue50]}>
        <Text variant="bodyStrong" numeric tone={invalid ? 'red' : 'blue'}>
          {time}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.row}>
      <Text variant="bodyStrong" style={styles.name}>
        {label}
      </Text>
      {timePill('startTime', DIRECTOR_SETTINGS_COPY.startsLabel(shiftName))}
      <Text tone="muted">{DIRECTOR_SETTINGS_COPY.shiftTimesJoiner}</Text>
      {timePill('endTime', DIRECTOR_SETTINGS_COPY.endsLabel(shiftName))}
    </View>
  );
}
