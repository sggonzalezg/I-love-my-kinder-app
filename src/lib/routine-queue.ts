import type { ChildGroup } from './room-groups';
import type { RoutineDraft, RoutineTarget } from './routine';

export type QueueStatus = 'pending' | 'rejected';
export type ChildSyncStatus = 'none' | 'pending' | 'synced' | 'rejected';
export type SyncFailure = 'rejected' | 'retry' | 'offline';

export interface QueuedRoutine {
  key: string;
  target: RoutineTarget;
  draft: RoutineDraft;
  status: QueueStatus;
}

const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_CONFLICT = 409;

export function routineKey({ childId, roomId, shiftId, routineDate }: RoutineTarget): string {
  return `${childId}:${roomId}:${shiftId}:${routineDate}`;
}

export function enqueueRoutine(queue: QueuedRoutine[], routine: QueuedRoutine): QueuedRoutine[] {
  const fresh = { ...routine, status: 'pending' as const };
  const index = queue.findIndex((item) => item.key === routine.key);
  if (index === -1) return [...queue, fresh];
  return queue.map((item, position) => (position === index ? fresh : item));
}

export function nextToSync(queue: QueuedRoutine[]): QueuedRoutine | null {
  return queue.find((item) => item.status === 'pending') ?? null;
}

export function removeFromQueue(queue: QueuedRoutine[], key: string): QueuedRoutine[] {
  return queue.filter((item) => item.key !== key);
}

export function markRejected(queue: QueuedRoutine[], key: string): QueuedRoutine[] {
  return queue.map((item) => (item.key === key ? { ...item, status: 'rejected' } : item));
}

export function pendingCount(queue: QueuedRoutine[], group: Pick<ChildGroup, 'roomId' | 'shiftId'>): number {
  return queue.filter((item) => item.status === 'pending' && item.target.roomId === group.roomId && item.target.shiftId === group.shiftId).length;
}

export function childSyncStatus(queue: QueuedRoutine[], loggedChildIds: Set<string>, target: RoutineTarget): ChildSyncStatus {
  const queued = queue.find((item) => item.key === routineKey(target));
  if (queued) return queued.status;
  return loggedChildIds.has(target.childId) ? 'synced' : 'none';
}

// save-routine answers 403 not_in_group when the teacher or the child left the group, and 400 for a payload it
// will never accept: retrying cannot fix either. 409 is two first saves racing, which a retry turns into a correction.
export function classifySyncFailure(status: number | undefined): SyncFailure {
  if (status === HTTP_FORBIDDEN || status === HTTP_BAD_REQUEST) return 'rejected';
  if (status === HTTP_CONFLICT) return 'retry';
  return 'offline';
}
