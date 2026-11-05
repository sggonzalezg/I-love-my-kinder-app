import { MONTHS } from './dates';

export type EventType = 'workshop' | 'meeting' | 'outing' | 'celebration' | 'no_classes' | 'other';

export const EVENT_TYPES: EventType[] = ['workshop', 'meeting', 'outing', 'celebration', 'no_classes', 'other'];

const EVENT_LABELS: Record<EventType, string> = {
  workshop: 'Taller',
  meeting: 'Reunión',
  outing: 'Salida',
  celebration: 'Fiesta o acto',
  no_classes: 'Sin clases',
  other: 'Otro',
};

export function eventTypeLabel(type: string): string {
  return EVENT_LABELS[type as EventType] ?? 'Otro';
}

/** Weeks of a month, Monday first; empty cells are null. `month` is 0-based. */
export function buildMonthGrid(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function monthTitle(year: number, month: number): string {
  const name = MONTHS[month];
  return name.charAt(0).toUpperCase() + name.slice(1);
}
