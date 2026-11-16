import {
  CHILD_ENROLLMENT_MESSAGES,
  canEnrollInAnotherGroup,
  changeGroupChoices,
  currentEnrollments,
  enrollGroupChoices,
  enrollmentSaveMessage,
  groupFormErrors,
  groupWrite,
  initialGroupValues,
  type ChildEnrollment,
  type StoredEnrollment,
} from '../child-enrollments';

const NOW = new Date('2026-11-16T12:00:00Z');
const ROOMS = [
  { id: 'room-10', name: 'Sala 10' },
  { id: 'room-2', name: 'Sala 2' },
];
const SHIFTS = [
  { id: 'shift-pm', name: 'afternoon' as const },
  { id: 'shift-am', name: 'morning' as const },
];
const MORNING_IN_ROOM_2: ChildEnrollment = { id: 'enr-am', roomId: 'room-2', roomName: 'Sala 2', shiftId: 'shift-am', shift: 'morning' };
const AFTERNOON_IN_ROOM_2: ChildEnrollment = { id: 'enr-pm', roomId: 'room-2', roomName: 'Sala 2', shiftId: 'shift-pm', shift: 'afternoon' };

function stored(overrides: Partial<StoredEnrollment>): StoredEnrollment {
  return { ...MORNING_IN_ROOM_2, endedAt: null, ...overrides };
}

describe('currentEnrollments', () => {
  it('lists the morning shift before the afternoon one', () => {
    const list = currentEnrollments([stored(AFTERNOON_IN_ROOM_2), stored(MORNING_IN_ROOM_2)], NOW);

    expect(list.map((enrollment) => enrollment.id)).toEqual(['enr-am', 'enr-pm']);
  });

  it('keeps an enrollment that ends in the future', () => {
    expect(currentEnrollments([stored({ endedAt: '2026-12-31T00:00:00Z' })], NOW)).toHaveLength(1);
  });

  it('leaves out an enrollment that already ended', () => {
    expect(currentEnrollments([stored({ endedAt: '2026-10-01T00:00:00Z' })], NOW)).toEqual([]);
  });

  it('drops the end date from the listed rows', () => {
    expect(currentEnrollments([stored({})], NOW)).toEqual([MORNING_IN_ROOM_2]);
  });
});

describe('canEnrollInAnotherGroup', () => {
  it('allows it while the child misses a shift', () => {
    expect(canEnrollInAnotherGroup([MORNING_IN_ROOM_2])).toBe(true);
  });

  it('refuses it when the child is in both shifts', () => {
    expect(canEnrollInAnotherGroup([MORNING_IN_ROOM_2, AFTERNOON_IN_ROOM_2])).toBe(false);
  });
});

describe('enrollGroupChoices', () => {
  it('offers only the room the child is already in', () => {
    expect(enrollGroupChoices(ROOMS, SHIFTS, [MORNING_IN_ROOM_2]).rooms).toEqual([{ value: 'room-2', label: 'Sala 2' }]);
  });

  it('offers only the shifts the child is not in yet', () => {
    expect(enrollGroupChoices(ROOMS, SHIFTS, [MORNING_IN_ROOM_2]).shifts).toEqual([{ value: 'shift-pm', label: 'Vespertino' }]);
  });

  it('offers every room in numeric order to a child with no group', () => {
    expect(enrollGroupChoices(ROOMS, SHIFTS, []).rooms.map((room) => room.label)).toEqual(['Sala 2', 'Sala 10']);
  });
});

describe('changeGroupChoices', () => {
  it('offers every room and both shifts, morning first', () => {
    const choices = changeGroupChoices(ROOMS, SHIFTS);

    expect(choices.rooms.map((room) => room.label)).toEqual(['Sala 2', 'Sala 10']);
    expect(choices.shifts.map((shift) => shift.label)).toEqual(['Matutino', 'Vespertino']);
  });
});

describe('initialGroupValues', () => {
  it('starts a change on the group being changed', () => {
    expect(initialGroupValues(changeGroupChoices(ROOMS, SHIFTS), MORNING_IN_ROOM_2)).toEqual({ roomId: 'room-2', shiftId: 'shift-am' });
  });

  it('starts a new enrollment on the only room and the first free shift', () => {
    expect(initialGroupValues(enrollGroupChoices(ROOMS, SHIFTS, [MORNING_IN_ROOM_2]), null)).toEqual({ roomId: 'room-2', shiftId: 'shift-pm' });
  });

  it('leaves the room to choose when several rooms are offered', () => {
    expect(initialGroupValues(enrollGroupChoices(ROOMS, SHIFTS, []), null).roomId).toBeNull();
  });
});

describe('groupFormErrors', () => {
  it('asks for the room and the shift', () => {
    expect(groupFormErrors({ roomId: null, shiftId: null })).toEqual({ roomId: 'Elegí la sala.', shiftId: 'Elegí el turno.' });
  });

  it('has no errors with both chosen', () => {
    expect(groupFormErrors({ roomId: 'room-2', shiftId: 'shift-am' })).toEqual({});
  });
});

describe('groupWrite', () => {
  it('inserts a new enrollment', () => {
    expect(groupWrite('nursery-1', 'child-1', null, { roomId: 'room-2', shiftId: 'shift-pm' })).toEqual({
      kind: 'enroll',
      row: { nursery_id: 'nursery-1', child_id: 'child-1', room_id: 'room-2', shift_id: 'shift-pm' },
    });
  });

  it('moves the changed group through move_children_to_group', () => {
    expect(groupWrite('nursery-1', 'child-1', MORNING_IN_ROOM_2, { roomId: 'room-10', shiftId: 'shift-am' })).toEqual({
      kind: 'move',
      args: { target_child_ids: ['child-1'], from_shift_id: 'shift-am', to_room_id: 'room-10', to_shift_id: 'shift-am' },
    });
  });

  it('writes nothing when the group did not change', () => {
    expect(groupWrite('nursery-1', 'child-1', MORNING_IN_ROOM_2, { roomId: 'room-2', shiftId: 'shift-am' })).toEqual({ kind: 'none' });
  });
});

describe('enrollmentSaveMessage', () => {
  it('explains a shift the child already has', () => {
    expect(enrollmentSaveMessage('child_already_in_shift')).toBe(CHILD_ENROLLMENT_MESSAGES.alreadyInShift);
  });

  it('explains that both shifts go in one room', () => {
    expect(enrollmentSaveMessage('child_in_other_room')).toBe(CHILD_ENROLLMENT_MESSAGES.otherRoom);
  });

  it('explains a room or shift that left the nursery', () => {
    expect(enrollmentSaveMessage('group_not_in_nursery')).toBe('Esa sala o ese turno ya no están en el jardín. Elegí otro.');
  });

  it('falls back to the generic failure', () => {
    expect(enrollmentSaveMessage('network down')).toBe('No pudimos guardar. Probá de nuevo.');
  });
});
