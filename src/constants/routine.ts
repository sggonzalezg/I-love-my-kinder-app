import type { Href } from 'expo-router';

import type { MealKey } from '@/lib/routine';

export function routineLogHref(groupKey: string, childIndex: number): Href {
  return `/log?group=${encodeURIComponent(groupKey)}&child=${childIndex}` as Href;
}

export const ROUTINE_QUEUE_STORAGE_KEY = 'routine-queue';

export const ROUTINE_SYNC_RETRY_MS = 30_000;
export const ROUTINE_CONFLICT_RETRIES = 2;

// Days of the group's routines read to start each child's Pañal / Baño switch on what was logged last.
export const LAST_HYGIENE_LOOKBACK_DAYS = 30;

export const QUICK_TIME_CHIPS_MINUTES = [15, 30] as const;

// shortcut: the nursery has no meal times in the schema yet; these are the design's times. Read them from the
// nursery settings once backend adds them (question for Seba in the SDD).
export const MEAL_TIMES: Record<MealKey, string> = { breakfast: '9:00', lunch: '11:45', snack: '16:00' };
