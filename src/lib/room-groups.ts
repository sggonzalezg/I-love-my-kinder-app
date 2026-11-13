import type { ShiftName } from './shift';

export interface ChildGroup {
  roomId: string;
  roomName: string;
  shiftId: string;
  shift: ShiftName;
}

export interface FamilyChild {
  id: string;
  firstName: string;
  lastName: string;
  photoPath: string | null;
  groups: ChildGroup[];
}

export interface RoomGroup extends ChildGroup {
  key: string;
}

/** Siblings in the same room and shift share one Sala; each other group is its own option. */
export function roomGroupsOf(children: FamilyChild[]): RoomGroup[] {
  const groups = new Map<string, RoomGroup>();
  for (const group of children.flatMap((child) => child.groups)) {
    const key = `${group.roomId}:${group.shiftId}`;
    if (!groups.has(key)) groups.set(key, { key, ...group });
  }
  return [...groups.values()];
}
