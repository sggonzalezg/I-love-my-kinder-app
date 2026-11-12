import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState } from 'react-native';

import { ROUTINE_CONFLICT_RETRIES, ROUTINE_QUEUE_STORAGE_KEY, ROUTINE_SYNC_RETRY_MS } from '@/constants/routine';
import { toSavePayload } from '@/lib/routine';
import { classifySyncFailure, enqueueRoutine, markRejected, nextToSync, removeFromQueue, type QueuedRoutine } from '@/lib/routine-queue';

import { invoke } from './supabase';
import type { GroupRoutine } from './teacher-day';

export interface RoutineQueueState {
  items: QueuedRoutine[];
  offline: boolean;
  /** Routines this session sent, by queue key, so Hoy shows them synced before it reads the group again. */
  synced: Record<string, GroupRoutine>;
}

let state: RoutineQueueState = { items: [], offline: false, synced: {} };
const listeners = new Set<() => void>();
let syncing = false;

function setState(next: Partial<RoutineQueueState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function persist() {
  AsyncStorage.setItem(ROUTINE_QUEUE_STORAGE_KEY, JSON.stringify(state.items)).catch((error: unknown) =>
    console.warn('Could not persist the routine queue:', error),
  );
}

const restored = AsyncStorage.getItem(ROUTINE_QUEUE_STORAGE_KEY)
  .then((stored) => {
    if (stored) setState({ items: JSON.parse(stored) as QueuedRoutine[] });
  })
  .catch((error: unknown) => console.warn('Could not restore the routine queue:', error));

export function queueRoutine(routine: QueuedRoutine) {
  setState({ items: enqueueRoutine(state.items, routine) });
  persist();
  void syncRoutines();
}

export async function syncRoutines() {
  if (syncing) return;
  syncing = true;
  let conflicts = 0;
  try {
    await restored;
    for (let next = nextToSync(state.items); next; next = nextToSync(state.items)) {
      try {
        const { routine } = await invoke<{ routine: GroupRoutine }>('save-routine', toSavePayload(next.draft, next.target));
        setState({ items: removeFromQueue(state.items, next.key), synced: { ...state.synced, [next.key]: routine }, offline: false });
      } catch (error) {
        const failure = classifySyncFailure((error as { status?: number }).status);
        if (failure === 'retry' && conflicts++ < ROUTINE_CONFLICT_RETRIES) continue;
        if (failure === 'rejected') {
          setState({ items: markRejected(state.items, next.key), offline: false });
          continue;
        }
        setState({ offline: true });
        break;
      }
      persist();
    }
    persist();
  } finally {
    syncing = false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The queue, kept syncing while the screen is mounted: at once, on return to the foreground and every 30 s. */
export function useRoutineQueue(): RoutineQueueState {
  useEffect(() => {
    void syncRoutines();
    const appState = AppState.addEventListener('change', (status) => status === 'active' && void syncRoutines());
    const timer = setInterval(() => void syncRoutines(), ROUTINE_SYNC_RETRY_MS);
    return () => {
      appState.remove();
      clearInterval(timer);
    };
  }, []);
  return useSyncExternalStore(subscribe, () => state);
}
