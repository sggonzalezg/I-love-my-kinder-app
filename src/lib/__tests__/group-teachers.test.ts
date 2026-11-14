import { isChoiceChecked, teacherChanges, teacherChoices, type GroupTeacherAssignment, type NurseryTeacher } from '../group-teachers';

const SALA_4_AFTERNOON = { roomId: 'room-4', shiftId: 'afternoon' };

const teachers: NurseryTeacher[] = [
  { id: 'paula', firstName: 'Paula', lastName: 'Gómez', isActive: true },
  { id: 'rosario', firstName: 'Rosario', lastName: 'Píriz', isActive: true },
  { id: 'julia', firstName: 'Julia', lastName: 'Ferreira', isActive: true },
  { id: 'ana', firstName: 'Ana', lastName: 'Suárez', isActive: false },
];

const assignments: GroupTeacherAssignment[] = [
  { teacherId: 'rosario', roomId: 'room-4', shiftId: 'afternoon', groupLabel: 'Sala 4 · Vespertino' },
  { teacherId: 'rosario', roomId: 'room-4', shiftId: 'morning', groupLabel: 'Sala 4 · Matutino' },
  { teacherId: 'julia', roomId: 'room-3', shiftId: 'morning', groupLabel: 'Sala 3 · Matutino' },
  { teacherId: 'paula', roomId: 'room-3', shiftId: 'morning', groupLabel: 'Sala 3 · Matutino' },
  { teacherId: 'paula', roomId: 'room-2', shiftId: 'morning', groupLabel: 'Sala 2 · Matutino' },
];

describe('teacherChoices', () => {
  it('lists the assigned teachers first, then the rest by name, leaving inactive ones out', () => {
    const choices = teacherChoices(teachers, assignments, SALA_4_AFTERNOON);

    expect(choices.map((choice) => choice.fullName)).toEqual(['Rosario Píriz', 'Julia Ferreira', 'Paula Gómez']);
  });

  it('marks who already gives the group', () => {
    const choices = teacherChoices(teachers, assignments, SALA_4_AFTERNOON);

    expect(choices.filter((choice) => choice.isAssigned).map((choice) => choice.teacherId)).toEqual(['rosario']);
  });

  it('names each teacher’s other groups under her name', () => {
    const choices = teacherChoices(teachers, assignments, SALA_4_AFTERNOON);

    expect(choices.map((choice) => choice.otherGroupsLine)).toEqual([
      'También Sala 4 · Matutino',
      'También Sala 3 · Matutino',
      'También Sala 2 · Matutino, Sala 3 · Matutino',
    ]);
  });

  it('has no other-groups line for a teacher with no other group', () => {
    const [choice] = teacherChoices([teachers[0]], [], SALA_4_AFTERNOON);

    expect(choice.otherGroupsLine).toBeNull();
  });
});

describe('isChoiceChecked', () => {
  const assigned = { teacherId: 'rosario', fullName: 'Rosario Píriz', isAssigned: true, otherGroupsLine: null };
  const unassigned = { teacherId: 'julia', fullName: 'Julia Ferreira', isAssigned: false, otherGroupsLine: null };

  it('keeps the stored assignment while nothing was toggled', () => {
    expect([isChoiceChecked(assigned, []), isChoiceChecked(unassigned, [])]).toEqual([true, false]);
  });

  it('flips a toggled teacher', () => {
    expect([isChoiceChecked(assigned, ['rosario', 'julia']), isChoiceChecked(unassigned, ['rosario', 'julia'])]).toEqual([false, true]);
  });
});

describe('teacherChanges', () => {
  const choices = teacherChoices(teachers, assignments, SALA_4_AFTERNOON);

  it('adds a newly checked teacher and removes an unchecked one', () => {
    expect(teacherChanges(choices, ['rosario', 'julia'])).toEqual({ added: ['julia'], removed: ['rosario'] });
  });

  it('has nothing to save while nothing was toggled', () => {
    expect(teacherChanges(choices, [])).toEqual({ added: [], removed: [] });
  });
});
