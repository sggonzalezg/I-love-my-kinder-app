import { INITIAL_SUPERVISION_STATE, SUPERVISION_ACTIONS, supervisionReducer } from '../supervision-reducer';

describe('supervisionReducer', () => {
  it('starts with every group closed', () => {
    expect(INITIAL_SUPERVISION_STATE.openGroupKeys).toEqual([]);
  });

  it('shows a group’s missing names on its first tap', () => {
    const state = supervisionReducer(INITIAL_SUPERVISION_STATE, { type: SUPERVISION_ACTIONS.GROUP_TOGGLED, groupKey: 'r2:am' });

    expect(state.openGroupKeys).toEqual(['r2:am']);
  });

  it('hides them on the second tap and keeps other groups open', () => {
    const open = { openGroupKeys: ['r2:am', 'r3:am'] };

    const state = supervisionReducer(open, { type: SUPERVISION_ACTIONS.GROUP_TOGGLED, groupKey: 'r2:am' });

    expect(state.openGroupKeys).toEqual(['r3:am']);
  });
});
