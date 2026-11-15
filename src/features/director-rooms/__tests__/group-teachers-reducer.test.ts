import { GROUP_TEACHERS_ACTIONS, INITIAL_GROUP_TEACHERS_STATE, groupTeachersReducer, type GroupTeachersState } from '../group-teachers-reducer';

const group = { roomId: 'room-4', shiftId: 'afternoon', label: 'Sala 4 · Vespertino' };

function openedState(): GroupTeachersState {
  return groupTeachersReducer(INITIAL_GROUP_TEACHERS_STATE, { type: GROUP_TEACHERS_ACTIONS.OPENED, group });
}

describe('groupTeachersReducer', () => {
  it('starts closed', () => {
    expect(INITIAL_GROUP_TEACHERS_STATE.group).toBeNull();
  });

  it('opens on a group with nothing toggled', () => {
    const state = openedState();

    expect([state.group, state.toggledIds, state.status]).toEqual([group, [], 'editing']);
  });

  it('counts every opening, so a reopened group loads its teachers again', () => {
    const reopened = groupTeachersReducer(
      groupTeachersReducer(openedState(), { type: GROUP_TEACHERS_ACTIONS.CLOSED }),
      { type: GROUP_TEACHERS_ACTIONS.OPENED, group },
    );

    expect(reopened.openCount).toBe(2);
  });

  it('toggles a teacher on and back off', () => {
    const once = groupTeachersReducer(openedState(), { type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId: 'julia' });
    const twice = groupTeachersReducer(once, { type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId: 'julia' });

    expect([once.toggledIds, twice.toggledIds]).toEqual([['julia'], []]);
  });

  it('ignores toggles while saving', () => {
    const saving = groupTeachersReducer(openedState(), { type: GROUP_TEACHERS_ACTIONS.SAVE_STARTED });
    const state = groupTeachersReducer(saving, { type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId: 'julia' });

    expect(state.toggledIds).toEqual([]);
  });

  it('keeps the choices after a failed save', () => {
    const toggled = groupTeachersReducer(openedState(), { type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId: 'julia' });
    const failed = groupTeachersReducer(groupTeachersReducer(toggled, { type: GROUP_TEACHERS_ACTIONS.SAVE_STARTED }), { type: GROUP_TEACHERS_ACTIONS.SAVE_FAILED });

    expect([failed.status, failed.toggledIds]).toEqual(['failed', ['julia']]);
  });

  it('closes and forgets the choices', () => {
    const toggled = groupTeachersReducer(openedState(), { type: GROUP_TEACHERS_ACTIONS.TOGGLED, teacherId: 'julia' });
    const closed = groupTeachersReducer(toggled, { type: GROUP_TEACHERS_ACTIONS.CLOSED });

    expect([closed.group, closed.toggledIds, closed.status]).toEqual([null, [], 'editing']);
  });
});
