import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { QUICK_TIME_CHIPS_MINUTES } from '@/constants/routine';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { formatDbTime } from '@/lib/dates';
import { minutesBefore, stepTime, toTimeValue, type TimeField } from '@/lib/teacher-day';
import { useBackgroundColorStyles } from '@/theme/color-styles';

import { styles } from './TimeSheet.styles';

const STEPS = [-1, 0, 1] as const;

interface TimeSheetProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  time: string;
  now: Date;
  confirmLabel: string;
  confirmIsAdd?: boolean;
  onChange: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TimeSheet({ visible, title, subtitle, time, now, confirmLabel, confirmIsAdd, onChange, onConfirm, onCancel, onDelete }: TimeSheetProps) {
  const backgroundStyles = useBackgroundColorStyles();
  const quickTimes = [
    { label: TEACHER_DAY_COPY.now(formatDbTime(toTimeValue(now))), value: toTimeValue(now) },
    ...QUICK_TIME_CHIPS_MINUTES.map((minutes) => ({ label: TEACHER_DAY_COPY.minutesAgo(minutes), value: minutesBefore(now, minutes) })),
  ];

  const choose = (next: string) => {
    if (next === time) return;
    Haptics.selectionAsync();
    onChange(next);
  };

  const column = (field: TimeField, label: string) => (
    <View style={styles.column} accessibilityRole="adjustable" accessibilityLabel={label}>
      {STEPS.map((delta) => {
        const value = delta === 0 ? time : stepTime(time, field, delta, now);
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
        <View style={styles.wheel}>
          {column('hour', TEACHER_DAY_COPY.hourColumn)}
          <Text style={styles.colon}>:</Text>
          {column('minute', TEACHER_DAY_COPY.minuteColumn)}
        </View>
        <Button label={confirmLabel} icon={confirmIsAdd ? Plus : undefined} block onPress={onConfirm} style={styles.confirm} />
        {onDelete ? <Button label={TEACHER_DAY_COPY.deleteEntry} variant="danger-soft" block onPress={onDelete} /> : null}
        <Button label={TEACHER_DAY_COPY.cancel} variant="plain" block onPress={onCancel} />
      </View>
    </Sheet>
  );
}
