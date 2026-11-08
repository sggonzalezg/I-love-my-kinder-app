import { CHAT_MESSAGE_LIMIT, POSTGRES_UNIQUE_VIOLATION } from '@/constants/chat';
import type { ChatMessage, ChatRead, ChatSenderRole, WorkHours } from '@/lib/chat';
import type { ChildGroup } from '@/lib/room-groups';
import { groupLabel, type ShiftName } from '@/lib/shift';

import { fetchRoomRoster, type RoomRoster } from './family-room';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface ChatThread extends ChildGroup {
  id: string;
  label: string;
}

export interface ChatThreadSummary {
  thread: ChatThread;
  latest: ChatMessage | null;
  unread: number;
}

interface ThreadRow {
  id: string;
  room_id: string;
  shift_id: string;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

interface MessageRow {
  id: string;
  client_id: string | null;
  thread_id: string;
  sender_id: string | null;
  sender_role: ChatSenderRole;
  sender_label: string;
  body: string | null;
  image_path: string | null;
  created_at: string;
}

interface ReadRow {
  thread_id: string;
  user_id: string;
  last_read_at: string;
}

interface WorkHoursRow {
  work_start_time: string | null;
  work_end_time: string | null;
}

const THREAD_COLUMNS = 'id, room_id, shift_id, rooms(name), shifts(name)';
const MESSAGE_COLUMNS = 'id, client_id, thread_id, sender_id, sender_role, sender_label, body, image_path, created_at';

function toThread(row: ThreadRow): ChatThread | null {
  if (!row.rooms || !row.shifts) return null;
  return {
    id: row.id,
    roomId: row.room_id,
    roomName: row.rooms.name,
    shiftId: row.shift_id,
    shift: row.shifts.name,
    label: groupLabel(row.rooms.name, row.shifts.name),
  };
}

function toMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    clientId: row.client_id,
    threadId: row.thread_id,
    senderId: row.sender_id,
    senderRole: row.sender_role,
    senderLabel: row.sender_label,
    body: row.body,
    imagePath: row.image_path,
    createdAt: row.created_at,
  };
}

/** A message from someone else (or from a deleted account) after the last read. */
async function countUnread(threadId: string, userId: string, lastReadAt: string | null): Promise<number> {
  let query = supabase
    .from('chat_messages')
    .select('id', { count: 'exact', head: true })
    .eq('thread_id', threadId)
    .or(`sender_id.is.null,sender_id.neq.${userId}`);
  if (lastReadAt) query = query.gt('created_at', lastReadAt);
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function fetchLatestMessage(threadId: string): Promise<ChatMessage | null> {
  const rows = throwOnError<MessageRow[]>(
    await supabase.from('chat_messages').select(MESSAGE_COLUMNS).eq('thread_id', threadId).order('created_at', { ascending: false }).limit(1),
  );
  return rows[0] ? toMessage(rows[0]) : null;
}

// RLS returns only the room chats the user belongs to now: the director gets every group of the nursery.
export async function fetchChatThreadSummaries(userId: string): Promise<ChatThreadSummary[]> {
  const [threadRows, readRows] = await Promise.all([
    supabase.from('chat_threads').select(THREAD_COLUMNS),
    supabase.from('chat_thread_reads').select('thread_id, user_id, last_read_at').eq('user_id', userId),
  ]);
  const threads = throwOnError<ThreadRow[]>(threadRows).flatMap((row) => toThread(row) ?? []);
  const lastReadByThread = new Map(throwOnError<ReadRow[]>(readRows).map((read) => [read.thread_id, read.last_read_at]));

  const summaries = await Promise.all(
    threads.map(async (thread) => {
      const [latest, unread] = await Promise.all([fetchLatestMessage(thread.id), countUnread(thread.id, userId, lastReadByThread.get(thread.id) ?? null)]);
      return { thread, latest, unread };
    }),
  );
  return summaries.sort((first, second) => (second.latest?.createdAt ?? '').localeCompare(first.latest?.createdAt ?? '') || first.thread.label.localeCompare(second.thread.label));
}

export async function fetchThreadRosters(threads: ChatThread[]): Promise<Map<string, RoomRoster>> {
  const rosters = await Promise.all(threads.map((thread) => fetchRoomRoster(thread)));
  return new Map(threads.map((thread, index) => [thread.id, rosters[index]]));
}

export async function fetchUnreadChatCount(userId: string): Promise<number> {
  const summaries = await fetchChatThreadSummaries(userId);
  return summaries.filter((summary) => summary.unread > 0).length;
}

/** Null when the user is no longer in that room chat. */
export async function fetchChatThread(threadId: string): Promise<ChatThread | null> {
  const row = throwOnError<ThreadRow | null>(await supabase.from('chat_threads').select(THREAD_COLUMNS).eq('id', threadId).maybeSingle());
  return row ? toThread(row) : null;
}

export async function fetchThreadMessages(threadId: string): Promise<ChatMessage[]> {
  const rows = throwOnError<MessageRow[]>(
    await supabase.from('chat_messages').select(MESSAGE_COLUMNS).eq('thread_id', threadId).order('created_at', { ascending: false }).limit(CHAT_MESSAGE_LIMIT),
  );
  return rows.map(toMessage);
}

export async function fetchThreadReads(threadId: string): Promise<ChatRead[]> {
  const rows = throwOnError<ReadRow[]>(await supabase.from('chat_thread_reads').select('thread_id, user_id, last_read_at').eq('thread_id', threadId));
  return rows.map((row) => ({ userId: row.user_id, lastReadAt: row.last_read_at }));
}

// The client id makes a retry idempotent: a second insert hits the unique key and the first row is the result.
export async function sendChatMessage({
  threadId,
  body,
  imagePath,
  clientId,
}: {
  threadId: string;
  body: string | null;
  imagePath: string | null;
  clientId: string;
}): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ thread_id: threadId, body, image_path: imagePath, client_id: clientId })
    .select(MESSAGE_COLUMNS)
    .single();
  if (error?.code === POSTGRES_UNIQUE_VIOLATION) {
    return toMessage(throwOnError<MessageRow>(await supabase.from('chat_messages').select(MESSAGE_COLUMNS).eq('client_id', clientId).single()));
  }
  if (error) throw new Error(error.message);
  return toMessage(data as MessageRow);
}

export async function markThreadRead(threadId: string, userId: string): Promise<void> {
  const now = new Date().toISOString();
  throwOnError(
    await supabase.from('chat_thread_reads').upsert({ thread_id: threadId, user_id: userId, last_read_at: now, updated_at: now }, { onConflict: 'thread_id,user_id' }),
  );
}

export function subscribeToThreadMessages(threadId: string, onMessage: (message: ChatMessage) => void): () => void {
  const channel = supabase
    .channel(`chat-thread-${threadId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` }, (payload) =>
      onMessage(toMessage(payload.new as MessageRow)),
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function fetchOwnWorkHours(userId: string): Promise<WorkHours | null> {
  const teacher = throwOnError<{ teacher_private_data: WorkHoursRow | WorkHoursRow[] | null } | null>(
    await supabase.from('teachers').select('teacher_private_data(work_start_time, work_end_time)').eq('user_id', userId).maybeSingle(),
  );
  const privateData = teacher?.teacher_private_data;
  const hours = Array.isArray(privateData) ? privateData[0] : privateData;
  if (!hours?.work_start_time || !hours.work_end_time) return null;
  return { start: hours.work_start_time, end: hours.work_end_time };
}

export function newClientId(userId: string): string {
  return `${userId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}
