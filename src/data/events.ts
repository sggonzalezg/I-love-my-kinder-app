import { SIGNED_URL_EXPIRY_SECONDS } from '@/constants/cache';
import { OUTING_EVENT_TYPE } from '@/constants/outing';
import { eventAuthorLabel, eventAuthorLine, eventFromRow, monthBounds, type Event, type EventRow } from '@/lib/calendar';
import type { EventReach } from '@/lib/event-cancellation';
import type { EventChange, EventWriteRow, StoredEventForm } from '@/lib/event-form';
import { outingAnswerCounts, type OutingAnswerCounts } from '@/lib/outing-form';
import { uploaderLabel } from '@/lib/story';

import { fetchRoomRoster } from './family-room';
import { DEFAULT_PERMISSION_VERSION, fetchOutingAnswers } from './outing-permission';
import { signedUrl, supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export type { Event } from '@/lib/calendar';

interface StoredEventRow extends EventRow {
  image_path: string | null;
  permission_version: number | null;
}

/** Staff rows name the author ("Vos · Sala 2 · Matutino"); family rows do not. */
export interface EventViewer {
  userId: string;
  isStaff: boolean;
}

interface AuthorRow {
  user_id: string;
  first_name: string;
  role: string;
}

export const EVENT_IMAGES_BUCKET = 'event-images';
const EVENT_COLUMNS =
  'id, title, event_type, starts_at, ends_at, all_day, location, transport, permission_version, description, image_path, created_by, room_id, shift_id, remind_day_before, changed_at, previous_values, rooms(name), shifts(name)';
const UPCOMING_EVENTS_LIMIT = 30;

async function signedImageUrls(paths: string[]): Promise<Map<string, string>> {
  if (paths.length === 0) return new Map();
  const { data } = await supabase.storage.from(EVENT_IMAGES_BUCKET).createSignedUrls(paths, SIGNED_URL_EXPIRY_SECONDS);
  return new Map((data ?? []).flatMap((signed) => (signed.path && signed.signedUrl ? [[signed.path, signed.signedUrl]] : [])));
}

/** RLS lets the director read every teacher and a teacher only her own row, so a teacher sees no author on the others' events. */
async function fetchAuthorLabels(rows: StoredEventRow[], viewer: EventViewer): Promise<Map<string, string>> {
  const labels = new Map<string, string>();
  if (!viewer.isStaff) return labels;
  const otherAuthorIds = [...new Set(rows.flatMap((row) => (row.created_by && row.created_by !== viewer.userId ? [row.created_by] : [])))];
  if (rows.some((row) => row.created_by === viewer.userId)) labels.set(viewer.userId, eventAuthorLabel(true, null)!);
  if (otherAuthorIds.length === 0) return labels;
  const authors = throwOnError<AuthorRow[]>(await supabase.from('teachers').select('user_id, first_name, role').in('user_id', otherAuthorIds));
  for (const author of authors) labels.set(author.user_id, eventAuthorLabel(false, { role: author.role, firstName: author.first_name })!);
  return labels;
}

/** Staff see how many children each outing's permission has; RLS returns a teacher only the children she teaches. */
async function fetchPermissionCounts(rows: StoredEventRow[], viewer: EventViewer): Promise<Map<string, OutingAnswerCounts>> {
  const outings = viewer.isStaff ? rows.filter((row) => row.event_type === OUTING_EVENT_TYPE) : [];
  const answers = await fetchOutingAnswers(outings.map((outing) => outing.id));
  const counts = new Map<string, OutingAnswerCounts>();
  for (const outing of outings) {
    const outingCounts = outingAnswerCounts(
      answers.filter((answer) => answer.event_id === outing.id),
      outing.permission_version ?? DEFAULT_PERMISSION_VERSION,
    );
    if (outingCounts.childCount > 0) counts.set(outing.id, outingCounts);
  }
  return counts;
}

async function withImagesAndAuthors(rows: StoredEventRow[], viewer: EventViewer, now: Date): Promise<Event[]> {
  const [imageUrls, authorLabels, permissionCounts] = await Promise.all([
    signedImageUrls(rows.flatMap((row) => (row.image_path ? [row.image_path] : []))),
    fetchAuthorLabels(rows, viewer),
    fetchPermissionCounts(rows, viewer),
  ]);
  return rows.map((row) =>
    eventFromRow(
      row,
      {
        imageUrl: row.image_path ? (imageUrls.get(row.image_path) ?? null) : null,
        authorLine: null,
        authorLabel: row.created_by ? (authorLabels.get(row.created_by) ?? null) : null,
        permissionCounts: permissionCounts.get(row.id) ?? null,
      },
      now,
    ),
  );
}

async function fetchHasAnyEvent(): Promise<boolean> {
  const { count, error } = await supabase.from('events').select('id', { count: 'exact', head: true });
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

/** RLS returns only the events the user received: the whole nursery's and those of its groups. */
export async function fetchMonthEvents(year: number, month: number, viewer: EventViewer, now: Date): Promise<{ events: Event[]; hasAnyEvent: boolean }> {
  const { start, end } = monthBounds(year, month);
  const rows = throwOnError<StoredEventRow[]>(
    await supabase.from('events').select(EVENT_COLUMNS).gte('starts_at', start.toISOString()).lt('starts_at', end.toISOString()).order('starts_at'),
  );
  const events = await withImagesAndAuthors(rows, viewer, now);
  return { events, hasAnyEvent: events.length > 0 || (await fetchHasAnyEvent()) };
}

export async function fetchUpcomingEvents(viewer: EventViewer, now: Date): Promise<Event[]> {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rows = throwOnError<StoredEventRow[]>(
    await supabase.from('events').select(EVENT_COLUMNS).gte('starts_at', startOfToday.toISOString()).order('starts_at').limit(UPCOMING_EVENTS_LIMIT),
  );
  return withImagesAndAuthors(rows, viewer, now);
}

async function fetchAuthorLine(createdBy: string | null, userId: string): Promise<string | null> {
  if (!createdBy) return null;
  if (createdBy === userId) return eventAuthorLine(true, null);
  const authors = throwOnError<AuthorRow[]>(await supabase.from('teachers').select('user_id, first_name, role').eq('user_id', createdBy).limit(1));
  const author = authors[0];
  return eventAuthorLine(false, author ? { role: author.role, firstName: author.first_name } : null);
}

/** Null when the event does not read: deleted, or not sent to this user. */
export async function fetchEvent(eventId: string, viewer: EventViewer, now: Date): Promise<Event | null> {
  const rows = throwOnError<StoredEventRow[]>(await supabase.from('events').select(EVENT_COLUMNS).eq('id', eventId).limit(1));
  const row = rows[0];
  if (!row) return null;
  const [imageUrl, authorLine, permissionCounts] = await Promise.all([
    signedUrl(row.image_path, EVENT_IMAGES_BUCKET),
    fetchAuthorLine(row.created_by, viewer.userId),
    fetchPermissionCounts([row], viewer),
  ]);
  return eventFromRow(row, { imageUrl, authorLine, permissionCounts: permissionCounts.get(row.id) ?? null }, now);
}

export async function cancelEvent(eventId: string, reason: string): Promise<void> {
  throwOnError(await supabase.rpc('cancel_event', { target_event_id: eventId, cancellation_reason: reason.trim() || null }));
}

async function fetchOwnTeacherId(userId: string): Promise<string | null> {
  const rows = throwOnError<{ id: string }[]>(await supabase.from('teachers').select('id').eq('user_id', userId).limit(1));
  return rows[0]?.id ?? null;
}

/** Only a room-and-shift event has one roster to count; the others are told in general words. */
export async function fetchEventReach(event: Pick<Event, 'room_id' | 'shift_id'>, userId: string): Promise<EventReach | null> {
  if (!event.room_id || !event.shift_id) return null;
  const [roster, ownTeacherId] = await Promise.all([fetchRoomRoster({ roomId: event.room_id, shiftId: event.shift_id }), fetchOwnTeacherId(userId)]);
  return {
    familyCount: roster.children.length,
    otherTeachers: roster.teachers
      .filter((teacher) => teacher.id !== ownTeacherId)
      .map((teacher) => uploaderLabel({ role: teacher.role, firstName: teacher.first_name })),
  };
}

const EVENT_FORM_COLUMNS = 'title, event_type, starts_at, ends_at, all_day, location, description, room_id, shift_id, remind_day_before, transport, permission_version';

export interface EventOwner {
  nurseryId: string;
  userId: string;
}

export type StoredEvent = StoredEventForm & { permission_version: number | null };

export async function fetchEventForm(eventId: string): Promise<StoredEvent | null> {
  const rows = throwOnError<StoredEvent[]>(await supabase.from('events').select(EVENT_FORM_COLUMNS).eq('id', eventId).limit(1));
  return rows[0] ?? null;
}

export async function createEvent(row: EventWriteRow, owner: EventOwner): Promise<void> {
  throwOnError(await supabase.from('events').insert({ ...row, nursery_id: owner.nurseryId, created_by: owner.userId }));
}

/** RLS turns a refused update into zero rows instead of an error. */
/** A new permission_version sends every outing answer back to pending. */
export async function updateEvent(eventId: string, row: EventWriteRow & EventChange & { permission_version?: number }): Promise<void> {
  const updated = throwOnError<{ id: string }[]>(await supabase.from('events').update(row).eq('id', eventId).select('id'));
  if (updated.length === 0) throw new Error(`Event ${eventId} was not updated`);
}

/** Only a room-and-shift audience has one roster to count. */
export async function fetchAudienceFamilyCount(roomId: string, shiftId: string | null): Promise<number | null> {
  if (!shiftId) return null;
  const roster = await fetchRoomRoster({ roomId, shiftId });
  return roster.children.length;
}
