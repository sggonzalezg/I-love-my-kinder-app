import { CircleAlert } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/text';
import { TimeButton } from '@/components/TimeButton/TimeButton';
import { FieldLabel } from '@/features/teacher-day/components/FieldLabel/FieldLabel';
import type { RestField } from '@/features/teacher-day/routine-log-reducer';
import { TEACHER_DAY_COPY } from '@/features/teacher-day/teacher-day-copy';
import { formatDbTime } from '@/lib/dates';
import { useColors } from '@/theme/use-theme';

import { ERROR_ICON_SIZE, styles } from './RestTimes.styles';

interface RestTimesProps {
  restStart: string | null;
  restEnd: string | null;
  noRest: boolean;
  invalid: boolean;
  showError: boolean;
  disabled: boolean;
  onPressTime: (field: RestField) => void;
  onToggleNoSleep: () => void;
}

export function RestTimes({ restStart, restEnd, noRest, invalid, showError, disabled, onPressTime, onToggleNoSleep }: RestTimesProps) {
  const colors = useColors();
  return (
    <View>
      <FieldLabel
        title={TEACHER_DAY_COPY.rest}
        aside={
          <Pressable onPress={onToggleNoSleep} disabled={disabled} hitSlop={12} accessibilityRole="button">
            <Text variant="smallStrong" tone="blue">
              {noRest ? TEACHER_DAY_COPY.sleptAfterAll : TEACHER_DAY_COPY.didNotSleep}
            </Text>
          </Pressable>
        }
      />
      {noRest ? null : (
        <View style={styles.row}>
          <TimeButton
            caption={restStart ? TEACHER_DAY_COPY.restStart : TEACHER_DAY_COPY.restStartEmpty}
            time={restStart ? formatDbTime(restStart) : null}
            disabled={disabled}
            onPress={() => onPressTime('restStart')}
          />
          <TimeButton
            caption={restEnd ? TEACHER_DAY_COPY.restEnd : TEACHER_DAY_COPY.restEndEmpty}
            time={restEnd ? formatDbTime(restEnd) : null}
            invalid={showError && invalid}
            disabled={disabled}
            onPress={() => onPressTime('restEnd')}
          />
        </View>
      )}
      {showError && invalid ? (
        <View style={styles.error} accessibilityRole="alert">
          <CircleAlert size={ERROR_ICON_SIZE} color={colors.red} strokeWidth={1.8} />
          <Text variant="smallStrong" tone="red">
            {TEACHER_DAY_COPY.restRangeError}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
