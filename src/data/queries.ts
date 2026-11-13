import type { ShiftName } from '@/lib/shift';

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
