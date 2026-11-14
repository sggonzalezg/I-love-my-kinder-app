import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { stepTime, type TimeField } from '@/lib/teacher-day';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './TimeSheet.styles';
import { TIME_SHEET_COPY } from './time-sheet-copy';

const STEPS = [-1, 0, 1] as const;

export interface QuickTime {
  label: string;
  value: string;
}

interface TimeSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  time: string;
  /** No step goes past this time (T4 logs only what already happened). */
  latest: Date;
  quickTimes: QuickTime[];
  minuteStep?: number;
  confirmLabel: string;
  confirmIsAdd?: boolean;
  onChange: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TimeSheet({
  visible,
  title,
  subtitle,
  time,
  latest,
  quickTimes,
  minuteStep = 1,
  confirmLabel,
  confirmIsAdd,
  onChange,
  onConfirm,
  onCancel,
  onDelete,
}: TimeSheetProps) {
  const backgroundStyles = useBackgroundColorStyles();

  const choose = (next: string) => {
    if (next === time) return;
    Haptics.selectionAsync();
    onChange(next);
  };

  const column = (field: TimeField, label: string) => (
    <View style={styles.column} accessibilityRole="adjustable" accessibilityLabel={label}>
      {STEPS.map((delta) => {
        const value = delta === 0 ? time : stepTime(time, field, field === 'minute' ? delta * minuteStep : delta, latest);
        const part = field === 'hour' ? value.slice(0, 2) : value.slice(3, 5);
        const isCurrent = delta === 0;
        return (
          <Pressable key={delta} disabled={isCurrent || value === time} onPress={() => choose(value)} hitSlop={4}>
            <Text numeric tone={isCurrent ? 'blue' : 'muted'} style={[styles.cell, isCurrent && styles.currentCell, isCurrent && backgroundStyles.blue50]}>
              {part}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Sheet visible={visible} onClose={onCancel}>
      <View style={styles.body}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="small" tone="muted">
            {subtitle}
          </Text>
        ) : null}
        {quickTimes.length > 0 ? (
        <View style={styles.chips}>
          {quickTimes.map((quick) => {
            const selected = quick.value === time;
            return (
              <Pressable
                key={quick.label}
                onPress={() => choose(quick.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[styles.chip, selected ? backgroundStyles.blue : backgroundStyles.raised]}>
                <Text variant="smallStrong" numeric tone={selected ? 'onBlue' : 'ink'}>
                  {quick.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        ) : null}
        <View style={styles.wheel}>
          {column('hour', TIME_SHEET_COPY.hourColumn)}
          <Text style={styles.colon}>:</Text>
          {column('minute', TIME_SHEET_COPY.minuteColumn)}
        </View>
        <Button label={confirmLabel} icon={confirmIsAdd ? Plus : undefined} block onPress={onConfirm} style={styles.confirm} />
        {onDelete ? <Button label={TIME_SHEET_COPY.deleteEntry} variant="danger-soft" block onPress={onDelete} /> : null}
        <Button label={TIME_SHEET_COPY.cancel} variant="plain" block onPress={onCancel} />
      </View>
    </Sheet>
  );
}
