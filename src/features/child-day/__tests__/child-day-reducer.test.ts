import { CHILD_DAY_ACTIONS, childDayReducer, initialChildDayState } from '../child-day-reducer';

const GROUP_KEYS = ['r2:s-am', 'r2:s-pm'];

describe('childDayReducer (F6)', () => {
  it('opens on the given day with the default group and no switch motion', () => {
    expect(initialChildDayState('2025-10-24')).toEqual({ isoDate: '2025-10-24', groupKey: null, enterFrom: null });
  });

  it('chooses another day and keeps the chosen group', () => {
    const withGroup = childDayReducer(initialChildDayState('2025-10-24'), { type: CHILD_DAY_ACTIONS.GROUP_CHOSEN, groupKey: 'r2:s-pm', fromKey: 'r2:s-am', groupKeys: GROUP_KEYS });
    const state = childDayReducer(withGroup, { type: CHILD_DAY_ACTIONS.DAY_CHOSEN, isoDate: '2025-10-23' });
    expect(state).toEqual({ isoDate: '2025-10-23', groupKey: 'r2:s-pm', enterFrom: null });
  });

  it('enters the afternoon from the right', () => {
    const state = childDayReducer(initialChildDayState('2025-10-24'), { type: CHILD_DAY_ACTIONS.GROUP_CHOSEN, groupKey: 'r2:s-pm', fromKey: 'r2:s-am', groupKeys: GROUP_KEYS });
    expect(state.enterFrom).toBe('right');
  });

  it('enters the morning from the left', () => {
    const state = childDayReducer(initialChildDayState('2025-10-24'), { type: CHILD_DAY_ACTIONS.GROUP_CHOSEN, groupKey: 'r2:s-am', fromKey: 'r2:s-pm', groupKeys: GROUP_KEYS });
    expect(state.enterFrom).toBe('left');
  });

  it('does nothing when the shown group is chosen again', () => {
    const state = initialChildDayState('2025-10-24');
    expect(childDayReducer(state, { type: CHILD_DAY_ACTIONS.GROUP_CHOSEN, groupKey: 'r2:s-am', fromKey: 'r2:s-am', groupKeys: GROUP_KEYS })).toBe(state);
  });
});
