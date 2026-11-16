import { ALL_ROOMS } from '@/lib/director-children';

export interface ChildrenListState {
  query: string;
  roomId: string;
}

export const INITIAL_CHILDREN_LIST_STATE: ChildrenListState = { query: '', roomId: ALL_ROOMS };

export const CHILDREN_LIST_ACTIONS = {
  QUERY_CHANGED: 'queryChanged',
  ROOM_CHOSEN: 'roomChosen',
} as const;

export type ChildrenListAction =
  | { type: typeof CHILDREN_LIST_ACTIONS.QUERY_CHANGED; query: string }
  | { type: typeof CHILDREN_LIST_ACTIONS.ROOM_CHOSEN; roomId: string };

export function childrenListReducer(state: ChildrenListState, action: ChildrenListAction): ChildrenListState {
  switch (action.type) {
    case CHILDREN_LIST_ACTIONS.QUERY_CHANGED:
      return { ...state, query: action.query };
    case CHILDREN_LIST_ACTIONS.ROOM_CHOSEN:
      return { ...state, roomId: action.roomId };
  }
}
