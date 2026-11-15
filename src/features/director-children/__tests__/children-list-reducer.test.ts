import { ALL_ROOMS } from '@/lib/director-children';

import { CHILDREN_LIST_ACTIONS, INITIAL_CHILDREN_LIST_STATE, childrenListReducer } from '../children-list-reducer';

describe('childrenListReducer', () => {
  it('starts with no query and every room', () => {
    expect(INITIAL_CHILDREN_LIST_STATE).toEqual({ query: '', roomId: ALL_ROOMS });
  });

  it('keeps what the director types', () => {
    const state = childrenListReducer(INITIAL_CHILDREN_LIST_STATE, { type: CHILDREN_LIST_ACTIONS.QUERY_CHANGED, query: 'mat' });
    expect(state).toEqual({ query: 'mat', roomId: ALL_ROOMS });
  });

  it('chooses a room and keeps the query', () => {
    const typed = { query: 'mat', roomId: ALL_ROOMS };
    expect(childrenListReducer(typed, { type: CHILDREN_LIST_ACTIONS.ROOM_CHOSEN, roomId: 'sala-2' })).toEqual({ query: 'mat', roomId: 'sala-2' });
  });
});
