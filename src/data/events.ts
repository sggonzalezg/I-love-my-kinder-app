import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { eventAuthorLine, eventFromRow, monthBounds, type Event, type EventRow } from '@/lib/calendar';

import { signedUrl, supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export type { Event } from '@/lib/calendar';

interface StoredEventRow extends EventRow {
  image_path: string | null;
  created_by: string | null;
}

interface AuthorRow {
  user_id: string;
  first_name: string;
  role: string;
}

export const EVENT_IMAGES_BUCKET = 'event-images';
const EVENT_COLUMNS =
  'id, title, event_type, starts_at, ends_at, all_day, location, description, image_path, created_by, remind_day_before, changed_at, previous_values, rooms(name), shifts(name)';
const UPCOMING_EVENTS_LIMIT = 30;

async function signedImageUrls(paths: string[]): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();
  const { data } = await supabase.storage.from(EVENT_IMAGES_BUCKET).createSignedUrls(paths, SIGNED_URL_EXPIRY_SECONDS);
  return new Map((data ?? []).flatMap((signed) => (signed.path && signed.signedUrl ? [[signed.path, signed.signedUrl]] : [])));
}

async function withImages(rows: StoredEventRow[], now: Date): Promise<Event[]> {
  const imageUrls = await signedImageUrls(rows.flatMap((row) => (row.image_path ? [row.image_path] : [])));
  return rows.map((row) => eventFromRow(row, { imageUrl: row.image_path ? (imageUrls.get(row.image_path) ?? null) : null, authorLine: null }, now));
}

async function fetchHasAnyEvent(): Promise<boolean> {
  const { count, error } = await supabase.from('events').select('id', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

/** RLS returns only the events the user received: the whole nursery's and those of its groups. */
export async function fetchMonthEvents(year: number, month: number, now: Date): Promise<{ events: Event[]; hasAnyEvent: boolean }> {
  const { start, end } = monthBounds(year, month);
  const rows = throwOnError<StoredEventRow[]>(
    await supabase.from('events').select(EVENT_COLUMNS).gte('starts_at', start.toISOString()).lt('starts_at', end.toISOString()).order('starts_at'),
  );
  const events = await withImages(rows, now);
  return { events, hasAnyEvent: events.length > 0 || (await fetchHasAnyEvent()) };
}

export async function fetchUpcomingEvents(now: Date): Promise<Event[]> {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rows = throwOnError<StoredEventRow[]>(
    await supabase.from('events').select(EVENT_COLUMNS).gte('starts_at', startOfToday.toISOString()).order('starts_at').limit(UPCOMING_EVENTS_LIMIT),
  );
  return withImages(rows, now);
}

async function fetchAuthorLine(createdBy: string | null, userId: string): Promise<string | null> {
  if (!createdBy) return null;
  if (createdBy === userId) return eventAuthorLine(true, null);
  const authors = throwOnError<AuthorRow[]>(await supabase.from('teachers').select('user_id, first_name, role').eq('user_id', createdBy).limit(1));
  const author = authors[0];
  return eventAuthorLine(false, author ? { role: author.role, firstName: author.first_name } : null);
}

/** Null when the event does not read: deleted, or not sent to this user. */
export async function fetchEvent(eventId: string, userId: string, now: Date): Promise<Event | null> {
  const rows = throwOnError<StoredEventRow[]>(await supabase.from('events').select(EVENT_COLUMNS).eq('id', eventId).limit(1));
  const row = rows[0];
  if (!row) return null;
  const [imageUrl, authorLine] = await Promise.all([signedUrl(row.image_path, EVENT_IMAGES_BUCKET), fetchAuthorLine(row.created_by, userId)]);
  return eventFromRow(row, { imageUrl, authorLine }, now);
}
