import {
  INITIAL_OUTING_PERMISSIONS_STATE,
  OUTING_PERMISSIONS_ACTIONS,
  outingPermissionsReducer,
  shownFilter,
} from '../outing-permissions-reducer';

describe('outingPermissionsReducer', () => {
  it('shows the filter the answers call for until the teacher picks one', () => {
    expect(shownFilter(INITIAL_OUTING_PERMISSIONS_STATE, 'pending')).toBe('pending');
  });

  it('keeps the filter the teacher picked', () => {
    const state = outingPermissionsReducer(INITIAL_OUTING_PERMISSIONS_STATE, { type: OUTING_PERMISSIONS_ACTIONS.FILTER_CHOSEN, filter: 'authorized' });

    expect(shownFilter(state, 'pending')).toBe('authorized');
  });
});
