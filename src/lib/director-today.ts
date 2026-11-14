import type { ChipVariant } from '@/components/chip';

import { audienceKey } from './event-form';
import { countLabel } from './format';
import type { ChildGroup } from './room-groups';
import { groupLabel, type ShiftName } from './shift';
import { isFutureTime } from './teacher-day';

export type GroupKeyRef = Pick<ChildGroup, 'roomId' | 'shiftId'>;

/** One open enrollment: the same child repeats once per group. */
export interface EnrolledChild extends ChildGroup {
  childId: string;
  name: string;
  /** As the backend stores it, "13:00:00". */
  shiftStartTime: string;
}

export interface TodayRoutineRef extends GroupKeyRef {
  childId: string;
}

export interface SupervisionGroup {
  key: string;
  label: string;
  total: number;
  logged: number;
  missingNames: string[];
  hasTeacher: boolean;
  notStarted: boolean;
  /** "13:00". */
  startTime: string;
}

const SHIFT_ORDER: ShiftName[] = ['morning', 'afternoon'];
const NAME_COLLATOR = new Intl.Collator('es', { numeric: true });

function groupKey({ roomId, shiftId }: GroupKeyRef): string {
  return audienceKey(roomId, shiftId);
}

function bySupervisionOrder(first: EnrolledChild, second: EnrolledChild): number {
  return SHIFT_ORDER.indexOf(first.shift) - SHIFT_ORDER.indexOf(second.shift) || NAME_COLLATOR.compare(first.roomName, second.roomName);
}

/** Group-days: a child in two shifts counts once in each group, logged only by the routine saved in that group. */
export function supervisionGroups(enrolled: EnrolledChild[], teacherGroups: GroupKeyRef[], todayRoutines: TodayRoutineRef[], now: Date): SupervisionGroup[] {
  const staffedKeys = new Set(teacherGroups.map(groupKey));
  const loggedKeys = new Set(todayRoutines.map((routine) => `${groupKey(routine)}:${routine.childId}`));
  const childrenByGroup = new Map<string, EnrolledChild[]>();
  for (const enrollment of [...enrolled].sort(bySupervisionOrder)) {
    const key = groupKey(enrollment);
    childrenByGroup.set(key, [...(childrenByGroup.get(key) ?? []), enrollment]);
  }

  return [...childrenByGroup].map(([key, children]) => {
    const [first] = children;
    const missingNames = children
      .filter((enrollment) => !loggedKeys.has(`${key}:${enrollment.childId}`))
      .map((enrollment) => enrollment.name)
      .sort(NAME_COLLATOR.compare);
    const logged = children.length - missingNames.length;
    const startTime = first.shiftStartTime.slice(0, 'HH:MM'.length);
    return {
      key,
      label: groupLabel(first.roomName, first.shift),
      total: children.length,
      logged,
      missingNames,
      hasTeacher: staffedKeys.has(key),
      notStarted: logged === 0 && isFutureTime(startTime, now),
      startTime,
    };
  });
}

export function supervisionTotals(groups: Pick<SupervisionGroup, 'logged' | 'total'>[]): { logged: number; total: number } {
  return groups.reduce((totals, group) => ({ logged: totals.logged + group.logged, total: totals.total + group.total }), { logged: 0, total: 0 });
}

export function supervisionChipVariant({ logged, total, notStarted }: Pick<SupervisionGroup, 'logged' | 'total' | 'notStarted'>): ChipVariant {
  if (logged === total) return 'ok';
  return notStarted ? 'grey' : 'blue';
}

export function loggedOfLabel(logged: number, total: number): string {
  return `${logged} de ${total}`;
}

export function missingLine(names: string[]): string {
  return `Faltan: ${names.join(', ')}`;
}

export function startsAtLine(startTime: string): string {
  return `Empieza a las ${startTime}`;
}

export function noTeacherLine(childCount: number): string {
  const children = childCount === 1 ? 'este niño' : `estos ${countLabel(childCount, 'niño', 'niños')}`;
  return `Nadie puede registrar el día de ${children}.`;
}
