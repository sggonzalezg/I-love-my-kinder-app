import { NEW_CHILD_MESSAGES, roomChoices, shiftChoices, type NewChildChoice, type NewChildRoom, type NewChildShift } from './new-child-form';
import { SHIFT_NAMES, type ShiftName } from './shift';

export const CHILD_ENROLLMENT_MESSAGES = {
  alreadyInShift: 'Ya está en ese turno. Elegí otro.',
  otherRoom: 'Un niño con los dos turnos tiene que estar en la misma sala.',
} as const;

export interface ChildEnrollment {
  id: string;
  roomId: string;
  roomName: string;
  shiftId: string;
  shift: ShiftName;
}

export interface StoredEnrollment extends ChildEnrollment {
  endedAt: string | null;
}

export interface GroupFormValues {
  roomId: string | null;
  shiftId: string | null;
}

export type GroupFormField = keyof GroupFormValues;
export type GroupFormErrors = Partial<Record<GroupFormField, string>>;

export interface GroupFormChoices {
  rooms: NewChildChoice[];
  shifts: NewChildChoice[];
}

export interface EnrollmentRow {
  nursery_id: string;
  child_id: string;
  room_id: string;
  shift_id: string;
}

export interface MoveToGroupArgs {
  target_child_ids: string[];
  from_shift_id: string;
  to_room_id: string;
  to_shift_id: string;
}

export type GroupWrite = { kind: 'none' } | { kind: 'enroll'; row: EnrollmentRow } | { kind: 'move'; args: MoveToGroupArgs };

/** As the panel, an enrollment with a future end date is still current ("Baja el 31/12"). */
export function currentEnrollments(enrollments: StoredEnrollment[], now: Date): ChildEnrollment[] {
  return enrollments
    .filter((enrollment) => !enrollment.endedAt || new Date(enrollment.endedAt) > now)
    .sort((first, second) => SHIFT_NAMES.indexOf(first.shift) - SHIFT_NAMES.indexOf(second.shift))
    .map(({ endedAt: _endedAt, ...enrollment }) => enrollment);
}

export function canEnrollInAnotherGroup(enrollments: ChildEnrollment[]): boolean {
  return enrollments.length < SHIFT_NAMES.length;
}

/** A child's open enrollments share one room (backend 058), so a new one goes in that room, in a shift it lacks. */
export function enrollGroupChoices(rooms: NewChildRoom[], shifts: NewChildShift[], enrollments: ChildEnrollment[]): GroupFormChoices {
  const currentRoomId = enrollments[0]?.roomId;
  return {
    rooms: roomChoices(currentRoomId ? rooms.filter((room) => room.id === currentRoomId) : rooms),
    shifts: shiftChoices(shifts.filter((shift) => !enrollments.some((enrollment) => enrollment.shiftId === shift.id))),
  };
}

export function changeGroupChoices(rooms: NewChildRoom[], shifts: NewChildShift[]): GroupFormChoices {
  return { rooms: roomChoices(rooms), shifts: shiftChoices(shifts) };
}

export function initialGroupValues(choices: GroupFormChoices, changing: ChildEnrollment | null): GroupFormValues {
  if (changing) return { roomId: changing.roomId, shiftId: changing.shiftId };
  return { roomId: choices.rooms.length === 1 ? choices.rooms[0].value : null, shiftId: choices.shifts[0]?.value ?? null };
}

export function groupFormErrors(values: GroupFormValues): GroupFormErrors {
  const errors: GroupFormErrors = {};
  if (!values.roomId) errors.roomId = NEW_CHILD_MESSAGES.roomMissing;
  if (!values.shiftId) errors.shiftId = NEW_CHILD_MESSAGES.shiftMissing;
  return errors;
}

/**
 * Only call with values that passed `groupFormErrors`. A change goes through `move_children_to_group` (one
 * transaction): a room change in the same shift takes the child's other shift along, as the panel.
 */
export function groupWrite(nurseryId: string, childId: string, changing: ChildEnrollment | null, values: GroupFormValues): GroupWrite {
  const roomId = values.roomId ?? '';
  const shiftId = values.shiftId ?? '';
  if (!changing) return { kind: 'enroll', row: { nursery_id: nurseryId, child_id: childId, room_id: roomId, shift_id: shiftId } };
  if (changing.roomId === roomId && changing.shiftId === shiftId) return { kind: 'none' };
  return { kind: 'move', args: { target_child_ids: [childId], from_shift_id: changing.shiftId, to_room_id: roomId, to_shift_id: shiftId } };
}

/** Maps the enrollment rules the database refuses (backend 058) to the panel's copy. */
export function enrollmentSaveMessage(errorMessage: string): string {
  if (errorMessage.includes('child_already_in_shift')) return CHILD_ENROLLMENT_MESSAGES.alreadyInShift;
  if (errorMessage.includes('child_in_other_room')) return CHILD_ENROLLMENT_MESSAGES.otherRoom;
  if (errorMessage.includes('group_not_in_nursery')) return NEW_CHILD_MESSAGES.groupNotInNursery;
  return NEW_CHILD_MESSAGES.saveFailed;
}
