import { eventTypeLabel } from '@/lib/calendar';
import { dayChipLabel, formatLongDate, formatTime, MONTHS_SHORT, sameDay, WEEKDAYS } from '@/lib/dates';
import type { FamilyChild } from '@/lib/room-groups';
import { groupLabel, type ShiftName } from '@/lib/shift';

export interface CancelledEvent {
  title: string;
  eventType: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  location: string | null;
  reason: string | null;
}

export interface Notice {
  id: string;
  title: string;
  body: string | null;
  imagePath: string | null;
  createdAt: string;
  createdBy: string | null;
  roomId: string | null;
  roomName: string | null;
  shift: ShiftName | null;
  cancelledEvent: CancelledEvent | null;
  unread: boolean;
}

const DAYS_SHOWN_AS_WEEKDAY = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NURSERY_WIDE_AUDIENCE = 'Todo el jardín';
const WITHDRAWN_TAIL = 'Los avisos que recibiste siguen acá hasta que elimines tu cuenta. No llegan avisos nuevos.';

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function joinNames(names: string[]): string {
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

/** "10:05" today, "Ayer", "Lun 19" within the week, "4 oct" this year, "19 dic 2025" before. */
export function noticeTimeLabel(sentAt: Date, now: Date): string {
  if (sameDay(sentAt, now)) return formatTime(sentAt);
  const daysAgo = Math.round((startOfDay(now) - startOfDay(sentAt)) / MS_PER_DAY);
  if (daysAgo < DAYS_SHOWN_AS_WEEKDAY) return dayChipLabel(sentAt, now);
  const dayAndMonth = `${sentAt.getDate()} ${MONTHS_SHORT[sentAt.getMonth()]}`;
  return sentAt.getFullYear() === now.getFullYear() ? dayAndMonth : `${dayAndMonth} ${sentAt.getFullYear()}`;
}

// shortcut: announcements store no sender name and families cannot read teachers (SDD gap 21); use a stored label once backend adds it.
export function noticeSender(notice: Notice, userId: string | null): string {
  if (notice.createdBy !== null && notice.createdBy === userId) return 'Vos';
  return notice.roomId === null ? 'Dirección' : 'La maestra';
}

export function noticeAudience(notice: Notice): string | null {
  if (notice.roomId === null) return NURSERY_WIDE_AUDIENCE;
  if (notice.roomName === null) return null;
  return notice.shift ? groupLabel(notice.roomName, notice.shift) : notice.roomName;
}

export function noticeMetaLine(notice: Notice, now: Date): string {
  const sentAt = new Date(notice.createdAt);
  const audience = noticeAudience(notice);
  const parts = [dayChipLabel(sentAt, now), formatTime(sentAt)];
  if (audience) parts.push(`Para ${audience}`);
  return parts.join(' · ');
}

function eventHours(event: CancelledEvent): string {
  return `${formatTime(new Date(event.startsAt))} a ${formatTime(new Date(event.endsAt))}`;
}

export function cancelledPreview(event: CancelledEvent): string {
  const start = new Date(event.startsAt);
  const day = `${WEEKDAYS[start.getDay()].toLowerCase()} ${start.getDate()}`;
  const when = event.allDay ? `Era el ${day}, todo el día.` : `Era el ${day}, de ${eventHours(event)}.`;
  return event.reason ? `${when} Motivo: ${event.reason}.` : when;
}

export function cancelledWhenLine(event: CancelledEvent): string {
  return `${formatLongDate(new Date(event.startsAt))} · ${event.allDay ? 'Todo el día' : eventHours(event)}`;
}

export function cancelledWhatLine(event: CancelledEvent): string {
  const type = eventTypeLabel(event.eventType);
  return event.location ? `${type} · ${event.location}` : type;
}

export function voidPermissionTitle(childNames: string[]): string {
  if (childNames.length === 0) return 'El permiso quedó sin efecto';
  if (childNames.length === 1) return `El permiso de ${childNames[0]} quedó sin efecto`;
  return `Los permisos de ${joinNames(childNames)} quedaron sin efecto`;
}

export function withdrawnBannerText(childNames: string[]): string {
  const verb = childNames.length > 1 ? 'ya no están' : 'ya no está';
  return `${joinNames(childNames)} ${verb} en el jardín. ${WITHDRAWN_TAIL}`;
}

export function bodyParagraphs(body: string | null): string[] {
  if (!body) return [];
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** A guardian linked through two family records gets two copies of a notice; it is unread while either is. */
export function mergeNotices(notices: Notice[]): Notice[] {
  const byId = new Map<string, Notice>();
  for (const notice of notices) {
    const kept = byId.get(notice.id);
    byId.set(notice.id, kept ? { ...kept, unread: kept.unread || notice.unread } : notice);
  }
  return [...byId.values()].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export function childrenInAudience(children: FamilyChild[], notice: Notice): string[] {
  return children
    .filter(
      (child) =>
        notice.roomId === null ||
        child.groups.some((group) => group.roomId === notice.roomId && (notice.shift === null || group.shift === notice.shift)),
    )
    .map((child) => child.firstName);
}
