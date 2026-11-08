import { dayChipLabel, dayKey, daySectionTitle, formatTime } from './dates';
import type { Role } from './role';
import type { ChildGroup, FamilyChild } from './room-groups';

export type ChatSenderRole = 'family' | 'teacher' | 'assistant' | 'director';

export interface ChatMessage {
  id: string;
  clientId: string | null;
  threadId: string;
  senderId: string | null;
  senderRole: ChatSenderRole;
  senderLabel: string;
  body: string | null;
  imagePath: string | null;
  createdAt: string;
}

export interface ChatRead {
  userId: string;
  lastReadAt: string;
}

export type ChatListItem<M extends ChatMessage = ChatMessage> = { kind: 'day'; key: string; title: string } | { kind: 'message'; key: string; message: M };

const DIRECTION_LABEL = 'Dirección';
const ROLE_SEPARATOR = ' · ';
const STAFF_ROLE_WORDS: Partial<Record<ChatSenderRole, string>> = { teacher: 'Maestra', assistant: 'Asistente' };

function previewName(role: ChatSenderRole, label: string): string {
  return role === 'director' ? DIRECTION_LABEL : label;
}

// The server stores the label; until it carries the role for staff, the app adds it (SDD gap 13).
export function senderLine(role: ChatSenderRole, label: string): string {
  if (role === 'director') return DIRECTION_LABEL;
  const roleWord = STAFF_ROLE_WORDS[role];
  if (!roleWord || label.includes(ROLE_SEPARATOR)) return label;
  return `${label}${ROLE_SEPARATOR}${roleWord}`;
}

export function messagePreview(message: ChatMessage | null, userId: string): string {
  if (!message) return 'Todavía no hay mensajes';
  const text = message.body ?? 'Foto';
  const name = message.senderId === userId ? 'Vos' : previewName(message.senderRole, message.senderLabel);
  return `${name}: ${text}`;
}

export function threadTimeLabel(createdAt: string, now: Date): string {
  const sent = new Date(createdAt);
  const day = dayChipLabel(sent, now);
  return day === 'Hoy' ? formatTime(sent) : day;
}

export function seenByCount(message: ChatMessage, reads: ChatRead[]): number {
  const sentAt = Date.parse(message.createdAt);
  return reads.filter((read) => read.userId !== message.senderId && Date.parse(read.lastReadAt) >= sentAt).length;
}

/** A sent message keeps the key of its sending bubble, so the list does not remount it. */
export function messageKey(message: Pick<ChatMessage, 'id' | 'clientId'>): string {
  return message.clientId ?? message.id;
}

/** Oldest first, with a separator before the first message of each day. */
export function chatListItems<M extends ChatMessage>(messages: M[], now: Date): ChatListItem<M>[] {
  const sorted = [...messages].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  const items: ChatListItem<M>[] = [];
  let previousDay: string | null = null;
  for (const message of sorted) {
    const day = new Date(message.createdAt);
    const key = dayKey(day);
    if (key !== previousDay) items.push({ kind: 'day', key: `day-${key}`, title: daySectionTitle(day, now) });
    items.push({ kind: 'message', key: messageKey(message), message });
    previousDay = key;
  }
  return items;
}

function countWords(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

const NO_TEACHER = 'Sin maestra';

export function membersLine({ familyCount, teacherNames, viewer }: { familyCount: number; teacherNames: string[]; viewer: Role }): string {
  const families = countWords(familyCount, 'familia', 'familias');
  if (viewer === 'director') {
    return teacherNames.length === 0 ? `${NO_TEACHER} · ${families}` : `${families}, ${joinNames(teacherNames)}`;
  }
  if (teacherNames.length === 0) return `${families} y ${DIRECTION_LABEL}`;
  return `${families}, ${countWords(teacherNames.length, 'maestra', 'maestras')} y ${DIRECTION_LABEL}`;
}

export function threadListMeta({
  familyCount,
  teacherFirstNames,
  childNames,
  viewer,
}: {
  familyCount: number;
  teacherFirstNames: string[];
  childNames: string[];
  viewer: Role;
}): string {
  const families = countWords(familyCount, 'familia', 'familias');
  if (viewer === 'director') return `${families} · ${teacherFirstNames.length === 0 ? NO_TEACHER : joinNames(teacherFirstNames)}`;
  if (viewer === 'family' && childNames.length > 0) return `Con ${joinNames(childNames)} · ${families}`;
  return families;
}

export interface WorkHours {
  start: string;
  end: string;
}

const SATURDAY = 6;
const SUNDAY = 0;

function minutesOf(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Working hours are Monday to Friday (design D8); they only decide the teacher's chat notifications. */
export function isOffWorkHours(now: Date, hours: WorkHours | null): boolean {
  if (!hours) return false;
  const weekday = now.getDay();
  if (weekday === SATURDAY || weekday === SUNDAY) return true;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes < minutesOf(hours.start) || minutes >= minutesOf(hours.end);
}

export function childNamesInGroup(children: FamilyChild[], group: Pick<ChildGroup, 'roomId' | 'shiftId'>): string[] {
  return children
    .filter((child) => child.groups.some((childGroup) => childGroup.roomId === group.roomId && childGroup.shiftId === group.shiftId))
    .map((child) => child.firstName);
}
