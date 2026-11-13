import { Text } from '@/components/text';
import { CALENDAR_COPY, pastListTitle, selectedDayTitle } from '@/features/calendar/calendar-copy';
import type { CalendarListKind } from '@/lib/calendar';

interface CalendarListTitleProps {
  kind: CalendarListKind;
  selectedDate: Date | null;
  monthName: string;
  today: Date;
}

export function CalendarListTitle({ kind, selectedDate, monthName, today }: CalendarListTitleProps) {
  if (kind === 'upcoming') return <Text variant="section">{CALENDAR_COPY.upcoming}</Text>;
  if (kind === 'past' || !selectedDate) return <Text variant="section">{pastListTitle(monthName)}</Text>;
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return (
    <Text variant="section">
      {selectedDayTitle(selectedDate)}
      {selectedDate < startOfToday ? <Text variant="small" tone="muted">{` ${CALENDAR_COPY.dayPassed}`}</Text> : null}
    </Text>
  );
}
