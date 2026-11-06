import type { ShiftName } from '@/lib/shift';

export interface Child {
  id: string;
  name: string;
  photo_url?: string;
  room: string;
  shift: ShiftName;
  second_shift?: ShiftName;
  birthday?: string; // YYYY-MM-DD
  status: 'enrolled' | 'withdrawn';
}

export interface RoutineEntry {
  id: string;
  type: 'meal' | 'nap' | 'hygiene';
  value: string; // meal name, nap time or diaper/toilet
  time?: string; // HH:mm
  notes?: string;
  signed_by?: string;
  signed_at?: string; // ISO datetime
}

export interface Routine {
  id: string;
  child_id: string;
  date: string; // ISO date
  shift: ShiftName;
  entries: RoutineEntry[];
  photo_url?: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  sender_name: string;
  sender_role: 'teacher' | 'director';
  room?: string;
  shift?: ShiftName;
  is_suspended?: boolean;
  created_at: string; // ISO datetime
}

export interface AnnouncementRecipient {
  id: string;
  announcement_id: string;
  user_id: string;
  seen_at?: string; // ISO datetime
}

// Mock children for development
export const mockChildren: Child[] = [
  {
    id: 'child-1',
    name: 'Mateo',
    room: 'Sala 2',
    shift: 'morning',
    second_shift: 'afternoon',
    birthday: '2023-06-15',
    status: 'enrolled',
  },
  {
    id: 'child-2',
    name: 'Ana',
    room: 'Sala 2',
    shift: 'morning',
    status: 'enrolled',
  },
];

export const mockRoutines: Routine[] = [
  {
    id: 'routine-1',
    child_id: 'child-1',
    date: new Date().toISOString().split('T')[0],
    shift: 'morning',
    entries: [
      {
        id: 'entry-1',
        type: 'meal',
        value: 'Desayuno',
        time: '08:30',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
      {
        id: 'entry-2',
        type: 'nap',
        value: 'Se durmió',
        time: '11:00',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
      {
        id: 'entry-3',
        type: 'hygiene',
        value: 'Pañal',
        time: '12:30',
        signed_by: 'Maestra Sofía',
        signed_at: new Date().toISOString(),
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'announce-1',
    title: 'Taller de arte',
    body: 'Este jueves haremos un taller especial de pintura con los chicos. Envíen ropa que no les importe ensuciarse.',
    image_url: 'https://via.placeholder.com/240x240?text=Taller+de+arte',
    sender_name: 'Maestra Sofía',
    sender_role: 'teacher',
    room: 'Sala 2',
    shift: 'morning',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'announce-2',
    title: 'Aviso importante',
    body: 'Recordamos que mañana es día de descanso. El jardín estará cerrado.',
    sender_name: 'Dirección',
    sender_role: 'director',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAnnouncementRecipients: AnnouncementRecipient[] = [
  {
    id: 'recipient-1',
    announcement_id: 'announce-1',
    user_id: 'user-1',
  },
  {
    id: 'recipient-2',
    announcement_id: 'announce-2',
    user_id: 'user-1',
    seen_at: new Date().toISOString(),
  },
];

export function getChildrenForFamily(): Child[] {
  return mockChildren;
}

export function getRoutineForChildDate(childId: string, date: string): Routine | undefined {
  return mockRoutines.find((r) => r.child_id === childId && r.date === date);
}

export function getTodayRoutine(childId: string): Routine | undefined {
  const today = new Date().toISOString().split('T')[0];
  return getRoutineForChildDate(childId, today);
}

export function getAnnouncements(): Announcement[] {
  return mockAnnouncements;
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return mockAnnouncements.find((a) => a.id === id);
}

export function getUnreadAnnouncementCount(userId: string): number {
  return mockAnnouncementRecipients.filter(
    (r) => r.user_id === userId && !r.seen_at
  ).length;
}

export function markAnnouncementAsSeen(announcementId: string, userId: string): void {
  const recipient = mockAnnouncementRecipients.find(
    (r) => r.announcement_id === announcementId && r.user_id === userId
  );
  if (recipient) {
    recipient.seen_at = new Date().toISOString();
  }
}
