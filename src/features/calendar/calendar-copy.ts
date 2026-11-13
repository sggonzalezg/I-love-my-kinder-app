import { monthTitle } from '@/lib/calendar';
import { WEEKDAYS, formatTime } from '@/lib/dates';

export const CALENDAR_COPY = {
  title: 'Calendario',
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  upcoming: 'Lo que viene',
  wholeMonth: 'Ver todo el mes',
  dayPassed: 'ya pasó',
  noEventsThatDay: 'Sin eventos este día',
  nothingUpcoming: 'Nada agendado por ahora',
  noEventsYetTitle: 'Todavía no hay eventos',
  emptyHint: 'Cuando el jardín agende talleres, reuniones o salidas, te avisamos y los ves acá.',
  loadError: 'No pudimos cargar el calendario.',
  retry: 'Reintentar',
  backToCalendar: 'Volver al calendario',
  eventNotFound: 'No encontramos este evento.',
  eventLoadError: 'No pudimos cargar el evento.',
  eventPassed: 'Ya pasó',
} as const;

export function pastListTitle(monthName: string): string {
  return `Lo que pasó en ${monthName}`;
}

export function showPastLabel(monthName: string, count: number): string {
  return `Ver lo que ya pasó en ${monthName} (${count})`;
}

export function emptyMonthTitle(monthName: string): string {
  return `Nada agendado en ${monthName}`;
}

export function backToMonthLabel(monthName: string): string {
  return `Volver a ${monthName}`;
}

export function selectedDayTitle(day: Date): string {
  return `${WEEKDAYS[day.getDay()]} ${day.getDate()}`;
}

export function changedTimeLine(previousTime: string): string {
  return `Cambió la hora: antes era a las ${previousTime}.`;
}

export function reminderLine(reminderAt: Date): string {
  return `Te recordamos el ${selectedDayTitle(reminderAt).toLowerCase()} a las ${formatTime(reminderAt)}.`;
}

export function monthHeading(year: number, month: number, today: Date): string {
  const title = monthTitle(year, month);
  return year === today.getFullYear() ? title : `${title} ${year}`;
}
