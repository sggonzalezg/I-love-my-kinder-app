import type { CancelledEvent, Notice, NoticeViewer } from '@/lib/notices';
import { guardianLine, mergeNotices, seenSummary } from '@/lib/notices';
import type { ShiftName } from '@/lib/shift';

import { uploaderLabel } from '@/lib/story';

import { signedUrl, supabase } from './supabase';
import { throwOnError } from './throw-on-error';

const NOTICE_IMAGES_BUCKET = 'announcement-images';
// shortcut: staff read the newest notices only; add paging when a nursery keeps more than this.
const STAFF_NOTICES_LIMIT = 100;
const NOTICE_COLUMNS = 'id, title, body, image_path, created_at, created_by, room_id, cancelled_event, rooms(name), shifts(name)';
// RLS returns recipient rows only to the notice's sender and to the direction.
const STAFF_NOTICE_COLUMNS = `${NOTICE_COLUMNS}, announcement_recipients(seen_at)`;

interface CancelledEventRow {
  title: string;
  event_type: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean;
  location: string | null;
  reason: string | null;
}

interface NoticeRow {
  id: string;
  title: string;
  body: string | null;
  image_path: string | null;
  created_at: string;
  created_by: string | null;
  room_id: string | null;
  cancelled_event: CancelledEventRow | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
  announcement_recipients?: { seen_at: string | null }[];
}

interface ViewerRow {
  id: string;
  seen_at: string | null;
  family_members: {
    first_name: string;
    last_name: string;
    family_member_children: { relationship: string; children: { first_name: string } | null }[];
  } | null;
}

function toCancelledEvent(row: CancelledEventRow | null): CancelledEvent | null {
  if (!row) return null;
  return {
    title: row.title,
    eventType: row.event_type,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    allDay: row.all_day,
    location: row.location,
    reason: row.reason,
  };
}

function toNotice(row: NoticeRow, unread: boolean): Notice {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    imagePath: row.image_path,
    createdAt: row.created_at,
    createdBy: row.created_by,
    roomId: row.room_id,
    roomName: row.rooms?.name ?? null,
    shift: row.shifts?.name ?? null,
    cancelledEvent: toCancelledEvent(row.cancelled_event),
    unread,
    seen: seenSummary((row.announcement_recipients ?? []).map((recipient) => ({ seenAt: recipient.seen_at }))),
  };
}

/** A family sees the notices it received, kept after a room change or a withdrawal. */
export async function fetchFamilyNotices(userId: string): Promise<Notice[]> {
  const rows = throwOnError<{ seen_at: string | null; announcements: NoticeRow | null }[]>(
    await supabase
      .from('announcement_recipients')
      .select(`seen_at, family_members!inner(user_id), announcements(${NOTICE_COLUMNS})`)
      .eq('family_members.user_id', userId),
  );
  return mergeNotices(rows.flatMap((row) => (row.announcements ? [toNotice(row.announcements, row.seen_at === null)] : [])));
}

export async function fetchStaffNotices(): Promise<Notice[]> {
  const rows = throwOnError<NoticeRow[]>(
    await supabase.from('announcements').select(STAFF_NOTICE_COLUMNS).order('created_at', { ascending: false }).limit(STAFF_NOTICES_LIMIT),
  );
  return rows.map((row) => toNotice(row, false));
}

/** A family's own recipient rows must not count as the notice's audience, so only staff read them. */
export async function fetchNotice(noticeId: string, isStaff: boolean): Promise<Notice | null> {
  const columns = isStaff ? STAFF_NOTICE_COLUMNS : NOTICE_COLUMNS;
  const row = throwOnError<NoticeRow | null>(await supabase.from('announcements').select(columns).eq('id', noticeId).maybeSingle());
  return row ? toNotice(row, false) : null;
}

/** RLS limits the update to the user's own recipient rows. */
export async function markNoticeSeen(noticeId: string): Promise<void> {
  throwOnError(
    await supabase
      .from('announcement_recipients')
      .update({ seen_at: new Date().toISOString() })
      .eq('announcement_id', noticeId)
      .is('seen_at', null),
  );
}

export async function fetchNoticeImageUrl(imagePath: string): Promise<string> {
  const url = await signedUrl(imagePath, NOTICE_IMAGES_BUCKET);
  if (!url) throw new Error(`No signed URL for notice image ${imagePath}`);
  return url;
}

export async function fetchNoticeViewers(noticeId: string): Promise<NoticeViewer[]> {
  const rows = throwOnError<ViewerRow[]>(
    await supabase
      .from('announcement_recipients')
      .select('id, seen_at, family_members(first_name, last_name, family_member_children(relationship, children(first_name)))')
      .eq('announcement_id', noticeId),
  );
  return rows.flatMap((row) => {
    const member = row.family_members;
    if (!member) return [];
    const links = member.family_member_children.flatMap((link) =>
      link.children ? [{ relationship: link.relationship, childFirstName: link.children.first_name }] : [],
    );
    return [{ id: row.id, name: `${member.first_name} ${member.last_name}`, relation: guardianLine(links), seenAt: row.seen_at }];
  });
}

/** Only the direction may read teachers, so only she gets the senders' names. */
export async function fetchSenderLabels(userIds: string[]): Promise<Map<string, string>> {
  if (userIds.length === 0) return new Map();
  const rows = throwOnError<{ user_id: string; first_name: string; role: string }[]>(
    await supabase.from('teachers').select('user_id, first_name, role').in('user_id', userIds),
  );
  return new Map(rows.map((row) => [row.user_id, uploaderLabel({ role: row.role, firstName: row.first_name })]));
}
