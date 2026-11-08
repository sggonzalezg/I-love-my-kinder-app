import type { ChildGroup } from './room-groups';
import { shiftLabel, type ShiftName } from './shift';

export type ChatThreadFilter = { kind: 'all' } | { kind: 'room'; roomId: string } | { kind: 'shift'; shift: ShiftName } | { kind: 'noTeacher' };

export interface ChatFilterChip {
  key: string;
  label: string;
  filter: ChatThreadFilter;
}

export const ALL_CHATS_FILTER: ChatThreadFilter = { kind: 'all' };
export const ALL_CHATS_FILTER_KEY = 'all';

const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const ALL_LABEL = 'Todas';
const NO_TEACHER_LABEL = 'Sin maestra';

/** Design D5: "Todas", each room, each shift, then "Sin maestra". */
export function chatFilterChips(threads: ChildGroup[]): ChatFilterChip[] {
  const roomNames = new Map(threads.map((thread) => [thread.roomId, thread.roomName]));
  const rooms = [...roomNames.entries()].sort(([, first], [, second]) => first.localeCompare(second, 'es', { numeric: true }));
  const shifts = SHIFT_ORDER.filter((shift) => threads.some((thread) => thread.shift === shift));

  return [
    { key: ALL_CHATS_FILTER_KEY, label: ALL_LABEL, filter: ALL_CHATS_FILTER },
    ...rooms.map(([roomId, roomName]) => ({ key: `room-${roomId}`, label: roomName, filter: { kind: 'room', roomId } as const })),
    ...shifts.map((shift) => ({ key: `shift-${shift}`, label: shiftLabel(shift), filter: { kind: 'shift', shift } as const })),
    { key: 'noTeacher', label: NO_TEACHER_LABEL, filter: { kind: 'noTeacher' } },
  ];
}

/** teacherCount is null while the group's roster loads. */
export function matchesChatFilter(thread: ChildGroup, teacherCount: number | null, filter: ChatThreadFilter): boolean {
  switch (filter.kind) {
    case 'all':
      return true;
    case 'room':
      return thread.roomId === filter.roomId;
    case 'shift':
      return thread.shift === filter.shift;
    case 'noTeacher':
      return teacherCount === 0;
  }
}
