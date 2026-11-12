import { defaultDraft, type RoutineTarget } from '../routine';
import {
  childSyncStatus,
  classifySyncFailure,
  enqueueRoutine,
  markRejected,
  nextToSync,
  pendingCount,
  removeFromQueue,
  routineKey,
  type QueuedRoutine,
} from '../routine-queue';

const target = (childId: string, routineDate = '2026-11-12'): RoutineTarget => ({ childId, roomId: 'room', shiftId: 'shift', routineDate });

function queued(childId: string, status: QueuedRoutine['status'] = 'pending'): QueuedRoutine {
  return { key: routineKey(target(childId)), target: target(childId), draft: defaultDraft('morning', null), status };
}

describe('routine sync queue (T4 offline)', () => {
  it('keys a routine by child, room, shift and day, like the backend unique key', () => {
    expect(routineKey(target('bruno'))).toBe('bruno:room:shift:2026-11-12');
  });

  it('appends a new routine at the end so routines sync in the order they were saved', () => {
    const queue = enqueueRoutine([queued('bruno')], queued('valentina'));
    expect(queue.map((item) => item.target.childId)).toEqual(['bruno', 'valentina']);
  });

  it('replaces a routine saved again for the same day in its place, as pending', () => {
    const edited = { ...queued('bruno'), draft: { ...defaultDraft('morning', null), notes: 'Pintamos' } };
    const queue = enqueueRoutine([queued('bruno', 'rejected'), queued('valentina')], edited);
    expect(queue.map((item) => [item.target.childId, item.status, item.draft.notes])).toEqual([
      ['bruno', 'pending', 'Pintamos'],
      ['valentina', 'pending', ''],
    ]);
  });

  it('syncs the oldest pending routine first and skips rejected ones', () => {
    expect(nextToSync([queued('bruno', 'rejected'), queued('valentina'), queued('tomas')])?.target.childId).toBe('valentina');
    expect(nextToSync([queued('bruno', 'rejected')])).toBeNull();
  });

  it('removes a synced routine and marks a refused one as rejected', () => {
    const queue = [queued('bruno'), queued('valentina')];
    expect(removeFromQueue(queue, queue[0].key).map((item) => item.target.childId)).toEqual(['valentina']);
    expect(markRejected(queue, queue[1].key)[1].status).toBe('rejected');
  });

  it('counts the pending routines of one group', () => {
    const otherGroup: QueuedRoutine = { ...queued('mateo'), target: { ...target('mateo'), roomId: 'other' }, key: 'other' };
    expect(pendingCount([queued('bruno'), queued('valentina', 'rejected'), otherGroup], { roomId: 'room', shiftId: 'shift' })).toBe(1);
  });

  it('gives each child its status: rejected and pending from the queue, then synced, then not logged', () => {
    const queue = [queued('bruno', 'rejected'), queued('valentina')];
    const logged = new Set(['mateo', 'valentina']);
    expect(childSyncStatus(queue, logged, target('bruno'))).toBe('rejected');
    expect(childSyncStatus(queue, logged, target('valentina'))).toBe('pending');
    expect(childSyncStatus(queue, logged, target('mateo'))).toBe('synced');
    expect(childSyncStatus(queue, logged, target('tomas'))).toBe('none');
  });

  it('ignores a queued routine of another day', () => {
    expect(childSyncStatus([queued('bruno')], new Set(), target('bruno', '2026-11-13'))).toBe('none');
  });

  it('rejects for good what the backend refuses, retries a race and waits on anything else', () => {
    expect(classifySyncFailure(403)).toBe('rejected');
    expect(classifySyncFailure(400)).toBe('rejected');
    expect(classifySyncFailure(409)).toBe('retry');
    expect(classifySyncFailure(500)).toBe('offline');
    expect(classifySyncFailure(undefined)).toBe('offline');
  });
});
