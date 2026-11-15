export interface NurseryTeacher {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface GroupTeacherAssignment {
  teacherId: string;
  roomId: string;
  shiftId: string;
  groupLabel: string;
}

export interface TeacherGroup {
  roomId: string;
  shiftId: string;
}

export interface TeacherChoice {
  teacherId: string;
  fullName: string;
  isAssigned: boolean;
  otherGroupsLine: string | null;
}

export interface GroupTeacherChanges {
  added: string[];
  removed: string[];
}

const NAME_COLLATOR = new Intl.Collator('es', { numeric: true });
const OTHER_GROUPS_PREFIX = 'También ';
const GROUPS_SEPARATOR = ', ';

function isSameGroup(assignment: GroupTeacherAssignment, group: TeacherGroup): boolean {
  return assignment.roomId === group.roomId && assignment.shiftId === group.shiftId;
}

function otherGroupsLine(teacherId: string, assignments: GroupTeacherAssignment[], group: TeacherGroup): string | null {
  const labels = new Set(assignments.filter((assignment) => assignment.teacherId === teacherId && !isSameGroup(assignment, group)).map((assignment) => assignment.groupLabel));
  if (!labels.size) return null;
  return `${OTHER_GROUPS_PREFIX}${[...labels].sort(NAME_COLLATOR.compare).join(GROUPS_SEPARATOR)}`;
}

export function teacherChoices(teachers: NurseryTeacher[], assignments: GroupTeacherAssignment[], group: TeacherGroup): TeacherChoice[] {
  return teachers
    .filter((teacher) => teacher.isActive)
    .map((teacher) => ({
      teacherId: teacher.id,
      fullName: `${teacher.firstName} ${teacher.lastName}`,
      isAssigned: assignments.some((assignment) => assignment.teacherId === teacher.id && isSameGroup(assignment, group)),
      otherGroupsLine: otherGroupsLine(teacher.id, assignments, group),
    }))
    .sort((first, second) => Number(second.isAssigned) - Number(first.isAssigned) || NAME_COLLATOR.compare(first.fullName, second.fullName));
}

export function isChoiceChecked(choice: TeacherChoice, toggledIds: string[]): boolean {
  return choice.isAssigned !== toggledIds.includes(choice.teacherId);
}

export function teacherChanges(choices: TeacherChoice[], toggledIds: string[]): GroupTeacherChanges {
  const toggled = choices.filter((choice) => toggledIds.includes(choice.teacherId));
  return {
    added: toggled.filter((choice) => !choice.isAssigned).map((choice) => choice.teacherId),
    removed: toggled.filter((choice) => choice.isAssigned).map((choice) => choice.teacherId),
  };
}
