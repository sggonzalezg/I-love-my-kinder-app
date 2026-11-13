import AsyncStorage from '@react-native-async-storage/async-storage';

import { FAMILY_TODAY_STORAGE_KEY_PREFIX } from '@/constants/cache';
import { toIsoDate } from '@/lib/dates';
import { kidDayStatus, loadWithSavedFallback, nextEventWindowEnd, type KidDayStatus, type NextEventTiming, type TodayRoutineKey } from '@/lib/family-today';
import type { FamilyChild } from '@/lib/room-groups';
import type { ShiftName } from '@/lib/shift';

import { fetchFamilyChildren } from './family-room';
import { supabase } from './supabase';
import { throwOnError } from './throw-on-error';

export interface TodayKid extends FamilyChild {
  dayStatus: KidDayStatus;
}

export interface NextEvent extends NextEventTiming {
  id: string;
  title: string;
}

export interface FamilyToday {
  firstName: string;
  kids: TodayKid[];
  unreadNotices: number;
  nextEvent: NextEvent | null;
}

interface RoutineKeyRow {
  child_id: string;
  room_id: string;
  shift_id: string;
}

interface NextEventRow {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  all_day: boolean | null;
  rooms: { name: string } | null;
  shifts: { name: ShiftName } | null;
}

async function fetchFirstName(userId: string): Promise<string> {
  const rows = throwOnError<{ first_name: string }[]>(await supabase.from('family_members').select('first_name').eq('user_id', userId).limit(1));
  return rows[0]?.first_name ?? '';
}

async function fetchTodayRoutineKeys(childIds: string[], today: Date): Promise<TodayRoutineKey[]> {
  if (childIds.length === 0) return [];
  const rows = throwOnError<RoutineKeyRow[]>(
    await supabase.from('routines').select('child_id, room_id, shift_id').in('child_id', childIds).eq('routine_date', toIsoDate(today)),
  );
  return rows.map((row) => ({ childId: row.child_id, roomId: row.room_id, shiftId: row.shift_id }));
}

async function fetchUnreadNoticeCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('announcement_recipients')
    .select('id, family_members!inner(user_id)', { count: 'exact', head: true })
    .eq('family_members.user_id', userId)
    .is('seen_at', null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function fetchNextEvent(now: Date): Promise<NextEvent | null> {
  const rows = throwOnError<NextEventRow[]>(
    await supabase
      .from('events')
      .select('id, title, starts_at, ends_at, all_day, rooms(name), shifts(name)')
      .gte('ends_at', now.toISOString())
      .lt('starts_at', nextEventWindowEnd(now).toISOString())
      .order('starts_at')
      .limit(1),
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    allDay: row.all_day ?? false,
    roomName: row.rooms?.name ?? null,
    shift: row.shifts?.name ?? null,
  };
}

async function fetchFamilyToday(userId: string, now: Date): Promise<FamilyToday> {
  const [firstName, children, unreadNotices, nextEvent] = await Promise.all([
    fetchFirstName(userId),
    fetchFamilyChildren(userId),
    fetchUnreadNoticeCount(userId),
    fetchNextEvent(now),
  ]);
  const todayRoutines = await fetchTodayRoutineKeys(
    children.map((child) => child.id),
    now,
  );
  const kids = children.map((child) => ({ ...child, dayStatus: kidDayStatus(child, todayRoutines) }));
  return { firstName, kids, unreadNotices, nextEvent };
}

async function readSavedFamilyToday(userId: string): Promise<FamilyToday | null> {
  const saved = await AsyncStorage.getItem(FAMILY_TODAY_STORAGE_KEY_PREFIX + userId);
  return saved ? (JSON.parse(saved) as FamilyToday) : null;
}

async function saveFamilyToday(userId: string, familyToday: FamilyToday): Promise<void> {
  await AsyncStorage.setItem(FAMILY_TODAY_STORAGE_KEY_PREFIX + userId, JSON.stringify(familyToday));
}

/** The last good load is kept per user, so Hoy still shows the children without a connection. */
export function loadFamilyToday(userId: string, now: Date) {
  return loadWithSavedFallback(
    () => fetchFamilyToday(userId, now),
    () => readSavedFamilyToday(userId),
    (familyToday) => saveFamilyToday(userId, familyToday),
  );
}
