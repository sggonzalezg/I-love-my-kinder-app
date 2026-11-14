import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { IconButton } from '@/components/icon-button';
import { MonthGrid } from '@/components/month-grid';
import { Sheet } from '@/components/sheet';
import { Text } from '@/components/text';
import { EVENT_FORM_COPY } from '@/features/calendar/event-form-copy';
import type { SheetMonth } from '@/features/calendar/event-form-reducer';
import { monthTitle } from '@/lib/calendar';
import { fromIsoDate, toIsoDate } from '@/lib/dates';
import { dateSheetDoneLabel } from '@/lib/event-form';

import { styles } from './DateSheet.styles';

interface DateSheetProps {
  visible: boolean;
  shownMonth: SheetMonth;
  selectedDate: string | null;
  minDate: Date;
  today: Date;
  /** "Un solo día": only the Hasta sheet clears its value. */
  onClear?: () => void;
  onMonthShift: (step: 1 | -1) => void;
  onChoose: (isoDate: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function DateSheet({ visible, shownMonth, selectedDate, minDate, today, onClear, onMonthShift, onChoose, onConfirm, onClose }: DateSheetProps) {
  const { year, month } = shownMonth;
  const selected = selectedDate ? fromIsoDate(selectedDate) : null;
  const selectedDay = selected && selected.getFullYear() === year && selected.getMonth() === month ? selected.getDate() : null;
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={styles.monthHeader}>
        <IconButton icon={ChevronLeft} label={EVENT_FORM_COPY.previousMonth} onPress={() => onMonthShift(-1)} />
        <Text variant="section">{monthTitle(year, month)}</Text>
        <IconButton icon={ChevronRight} label={EVENT_FORM_COPY.nextMonth} onPress={() => onMonthShift(1)} />
      </View>
      <MonthGrid
        year={year}
        month={month}
        selectedDay={selectedDay}
        minDate={minDate}
        today={isCurrentMonth ? today.getDate() : undefined}
        showLegend={false}
        onDayPress={(day) => onChoose(toIsoDate(new Date(year, month, day)))}
      />
      <View style={styles.actions}>
        <Button label={selectedDate ? dateSheetDoneLabel(selectedDate) : EVENT_FORM_COPY.chooseDay} block disabled={!selectedDate} onPress={onConfirm} />
        {onClear ? <Button label={EVENT_FORM_COPY.oneDay} variant="plain" block onPress={onClear} /> : null}
      </View>
    </Sheet>
  );
}
