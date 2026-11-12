import { PressableScale } from '@/components/pressable-scale';
import { Text } from '@/components/text';

import { EMPTY_TIME, styles, useTimeButtonStyles } from './TimeButton.styles';

interface TimeButtonProps {
  caption: string;
  /** Shown as is ("10:42"); null shows "--:--". */
  time: string | null;
  onPress: () => void;
  invalid?: boolean;
  disabled?: boolean;
}

export function TimeButton({ caption, time, onPress, invalid, disabled }: TimeButtonProps) {
  const themed = useTimeButtonStyles();
  const frame = invalid ? themed.invalid : time ? themed.set : themed.empty;
  return (
    <PressableScale
      containerStyle={styles.container}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${caption}: ${time ?? EMPTY_TIME}`}
      style={[styles.button, frame]}>
      <Text variant="caption" tone="muted">
        {caption}
      </Text>
      <Text numeric tone={time && !invalid ? 'blue' : 'ink'} style={styles.time}>
        {time ?? EMPTY_TIME}
      </Text>
    </PressableScale>
  );
}
