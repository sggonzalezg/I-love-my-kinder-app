import type { Href } from 'expo-router';

export function routineLogHref(groupKey: string, childIndex: number): Href {
  return `/log?group=${encodeURIComponent(groupKey)}&child=${childIndex}` as Href;
}

export const ROUTINE_QUEUE_STORAGE_KEY = 'routine-queue';

export const ROUTINE_SYNC_RETRY_MS = 30_000;
export const ROUTINE_CONFLICT_RETRIES = 2;

// Days of the group's routines read to start each child's Pañal / Baño switch on what was logged last.
export const LAST_HYGIENE_LOOKBACK_DAYS = 30;

export const QUICK_TIME_CHIPS_MINUTES = [15, 30] as const;

// The family F6 day strip: today and the 13 days before it.
export const CHILD_DAY_STRIP_DAYS = 14;
