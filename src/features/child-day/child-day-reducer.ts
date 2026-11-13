export const CHILD_DAY_ACTIONS = {
  DAY_CHOSEN: 'dayChosen',
  GROUP_CHOSEN: 'groupChosen',
} as const;

export type EnterSide = 'left' | 'right';

export interface ChildDayState {
  isoDate: string;
  /** null shows the group of the current shift. */
  groupKey: string | null;
  enterFrom: EnterSide | null;
}

export type ChildDayAction =
  | { type: typeof CHILD_DAY_ACTIONS.DAY_CHOSEN; isoDate: string }
  | { type: typeof CHILD_DAY_ACTIONS.GROUP_CHOSEN; groupKey: string; fromKey: string; groupKeys: string[] };

export function initialChildDayState(isoDate: string): ChildDayState {
  return { isoDate, groupKey: null, enterFrom: null };
}

export function childDayReducer(state: ChildDayState, action: ChildDayAction): ChildDayState {
  switch (action.type) {
    case CHILD_DAY_ACTIONS.DAY_CHOSEN:
      return { ...state, isoDate: action.isoDate, enterFrom: null };
    case CHILD_DAY_ACTIONS.GROUP_CHOSEN: {
      if (action.groupKey === action.fromKey) return state;
      const enterFrom = action.groupKeys.indexOf(action.groupKey) > action.groupKeys.indexOf(action.fromKey) ? 'right' : 'left';
      return { ...state, groupKey: action.groupKey, enterFrom };
    }
  }
}
