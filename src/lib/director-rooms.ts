import { upcomingBirthdays } from './birthdays';
import { countLabel } from './format';
import { groupLabel, type ShiftName } from './shift';
import { todayBirthdayLine } from './teacher-room';

export interface DirectorRoomRow {
  id: string;
  name: string;
  description: string | null;
}

export interface DirectorShiftRow {
  id: string;
  name: ShiftName;
}

export interface OpenEnrollment {
  childId: string;
  roomId: string;
  shiftId: string;
  firstName: string;
  birthDate: string | null;
}

export interface OpenAssignment {
  teacherId: string;
  roomId: string;
  shiftId: string;
  firstName: string;
  isActive: boolean;
}

export interface DirectorRoomsInput {
  rooms: DirectorRoomRow[];
  shifts: DirectorShiftRow[];
  enrollments: OpenEnrollment[];
  assignments: OpenAssignment[];
}

export interface DirectorGroup {
  roomId: string;
  shiftId: string;
  shift: ShiftName;
  label: string;
  childrenCount: number;
  teacherNames: string[];
}

export interface DirectorRoomCard {
  id: string;
  name: string;
  description: string | null;
  groups: DirectorGroup[];
}

export interface BirthdayToday {
  childId: string;
  firstName: string;
  detail: string;
}

type GroupStaffing = Pick<DirectorGroup, 'childrenCount' | 'teacherNames'>;

const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const ROOM_NAME_COLLATOR = new Intl.Collator('es', { numeric: true });
const NAMES_JOINER = ' y ';
const NAMES_SEPARATOR = ', ';
const META_SEPARATOR = ' · ';
const AGE_PREFIX = '· ';

function groupKey(roomId: string, shiftId: string): string {
  return `${roomId}:${shiftId}`;
}

function distinctByGroup<T extends { roomId: string; shiftId: string }>(rows: T[], memberOf: (row: T) => string): Map<string, Map<string, T>> {
  const byGroup = new Map<string, Map<string, T>>();
  for (const row of rows) {
    const key = groupKey(row.roomId, row.shiftId);
    const members = byGroup.get(key) ?? new Map<string, T>();
    if (!members.has(memberOf(row))) members.set(memberOf(row), row);
    byGroup.set(key, members);
  }
  return byGroup;
}

/** Every room runs every nursery shift, as the panel W12: `rooms` stores no shifts of its own. */
export function buildRoomCards({ rooms, shifts, enrollments, assignments }: DirectorRoomsInput): DirectorRoomCard[] {
  const childrenByGroup = distinctByGroup(enrollments, (enrollment) => enrollment.childId);
  const teachersByGroup = distinctByGroup(
    assignments.filter((assignment) => assignment.isActive),
    (assignment) => assignment.teacherId,
  );
  const orderedShifts = [...shifts].sort((first, second) => SHIFT_ORDER.indexOf(first.name) - SHIFT_ORDER.indexOf(second.name));

  return [...rooms]
    .sort((first, second) => ROOM_NAME_COLLATOR.compare(first.name, second.name))
    .map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      groups: orderedShifts.map((shift) => {
        const key = groupKey(room.id, shift.id);
        return {
          roomId: room.id,
          shiftId: shift.id,
          shift: shift.name,
          label: groupLabel(room.name, shift.name),
          childrenCount: childrenByGroup.get(key)?.size ?? 0,
          teacherNames: [...(teachersByGroup.get(key)?.values() ?? [])].map((assignment) => assignment.firstName),
        };
      }),
    }));
}

export function roomTitleAge(description: string | null): string | null {
  const age = description?.trim();
  return age ? `${AGE_PREFIX}${age}` : null;
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(NAMES_SEPARATOR)}${NAMES_JOINER}${names[names.length - 1]}`;
}

export function childrenLabel(count: number): string {
  return countLabel(count, 'niño', 'niños');
}

export function groupMetaLine({ childrenCount, teacherNames }: GroupStaffing): string {
  return [childrenLabel(childrenCount), ...(teacherNames.length ? [joinNames(teacherNames)] : [])].join(META_SEPARATOR);
}

/** Nobody can log the day of a group with children and no teacher. */
export function hasNoTeacher({ childrenCount, teacherNames }: GroupStaffing): boolean {
  return childrenCount > 0 && teacherNames.length === 0;
}

export function noTeacherGroups(cards: DirectorRoomCard[]): DirectorGroup[] {
  return cards.flatMap((card) => card.groups).filter(hasNoTeacher);
}

export function noTeacherGroupLine(label: string): string {
  return `${label} no tiene maestra.`;
}

export function noTeacherRosterLine(childrenCount: number): string {
  return `Sin maestra. Nadie puede registrar el día de ${childrenCount === 1 ? 'este niño' : `estos ${childrenCount} niños`}.`;
}

/** A child in two groups has one birthday: the card names the first group in card order. */
export function birthdaysToday(cards: DirectorRoomCard[], enrollments: OpenEnrollment[], today: Date): BirthdayToday[] {
  const groupLabels = new Map(cards.flatMap((card) => card.groups).map((group) => [groupKey(group.roomId, group.shiftId), group.label]));
  const groupOrder = [...groupLabels.keys()];
  const firstGroupOfChild = new Map<string, OpenEnrollment>();
  for (const enrollment of enrollments) {
    const known = firstGroupOfChild.get(enrollment.childId);
    const order = groupOrder.indexOf(groupKey(enrollment.roomId, enrollment.shiftId));
    if (!known || order < groupOrder.indexOf(groupKey(known.roomId, known.shiftId))) firstGroupOfChild.set(enrollment.childId, enrollment);
  }

  const children = [...firstGroupOfChild.values()];
  return upcomingBirthdays(
    children.map((child) => ({ id: child.childId, name: child.firstName, birthDate: child.birthDate })),
    today,
    0,
  )
    .filter((birthday) => birthday.isToday)
    .map((birthday) => {
      const child = firstGroupOfChild.get(birthday.id)!;
      return {
        childId: child.childId,
        firstName: child.firstName,
        detail: todayBirthdayLine(birthday.ageTurning, groupLabels.get(groupKey(child.roomId, child.shiftId)) ?? ''),
      };
    });
}
