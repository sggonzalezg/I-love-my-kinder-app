import type { EventType } from '@/lib/calendar';

export interface Event {
  id: string;
  type: EventType;
  title: string;
  date: string; // ISO date
  time_start?: string; // HH:mm or null for all-day
  time_end?: string; // HH:mm or null for all-day
  place?: string;
  description?: string;
  image_url?: string;
  audience: string; // e.g. "Sala 2 · Matutino"
  created_by?: string; // e.g. "Maestra Sofía" or "Dirección"
  reminder_at?: string; // ISO datetime for reminder
  changed_at?: string; // ISO datetime if changed in the last 3 days
  changed_previous_time?: string; // Previous time HH:mm if changed
}

// Mock events for development
export const mockEvents: Event[] = [
  {
    id: '1',
    type: 'workshop',
    title: 'Taller de pintura',
    date: '2026-11-10',
    time_start: '09:30',
    time_end: '11:00',
    place: 'Aula de arte',
    description: 'Los niños van a pintar con acuarelas.',
    audience: 'Sala 2 · Matutino',
    created_by: 'Maestra Sofía',
    reminder_at: '2026-11-09T18:00:00Z',
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Reunión informativa',
    date: '2026-11-12',
    time_start: '10:00',
    time_end: '11:30',
    place: 'Sala de reuniones',
    description: 'Información sobre el proyecto del semestre.',
    audience: 'Sala 1 · Vespertino',
    created_by: 'Dirección',
  },
  {
    id: '3',
    type: 'outing',
    title: 'Salida al Parque Rodó',
    date: '2026-11-15',
    time_start: '14:00',
    time_end: '15:30',
    place: 'Parque Rodó',
    audience: 'Sala 2 · Matutino',
    created_by: 'Maestra Sofía',
  },
  {
    id: '4',
    type: 'no_classes',
    title: 'Sin clases',
    date: '2026-11-20',
    audience: 'Todo el jardín',
    created_by: 'Dirección',
  },
  {
    id: '5',
    type: 'celebration',
    title: 'Fiesta de fin de año',
    date: '2026-12-19',
    time_start: '15:00',
    time_end: '17:00',
    place: 'Jardín',
    description: 'Celebración de fin de año con familias.',
    audience: 'Todo el jardín',
    created_by: 'Dirección',
  },
];

export function getEventsForMonth(year: number, month: number): Event[] {
  return mockEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month;
  });
}

export function getEventsByDate(date: string): Event[] {
  return mockEvents.filter((event) => event.date === date).sort((a, b) => {
    const aTime = a.time_start || '00:00';
    const bTime = b.time_start || '00:00';
    return aTime.localeCompare(bTime);
  });
}

export function getUpcomingEvents(fromDate: string, daysAhead: number = 30): Event[] {
  const from = new Date(fromDate);
  const to = new Date(from);
  to.setDate(to.getDate() + daysAhead);

  return mockEvents
    .filter((event) => {
      const eventDate = new Date(event.date + 'T00:00:00Z');
      return eventDate >= from && eventDate <= to;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPastEvents(
  upToDate: string,
  daysBack: number = 30,
  year?: number,
  month?: number
): Event[] {
  const upTo = new Date(upToDate);
  const from = new Date(upTo);
  from.setDate(from.getDate() - daysBack);

  let filtered = mockEvents.filter((event) => {
    const eventDate = new Date(event.date + 'T00:00:00Z');
    return eventDate < upTo && eventDate >= from;
  });

  if (year !== undefined && month !== undefined) {
    filtered = filtered.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() === month;
    });
  }

  return filtered.sort((a, b) => b.date.localeCompare(a.date));
}
