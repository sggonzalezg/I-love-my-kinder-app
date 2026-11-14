export const SUPERVISION_ACTIONS = {
  GROUP_TOGGLED: 'groupToggled',
} as const;

export interface SupervisionState {
  openGroupKeys: string[];
}

export type SupervisionAction = { type: typeof SUPERVISION_ACTIONS.GROUP_TOGGLED; groupKey: string };

export const INITIAL_SUPERVISION_STATE: SupervisionState = { openGroupKeys: [] };

export function supervisionReducer(state: SupervisionState, action: SupervisionAction): SupervisionState {
  switch (action.type) {
    case SUPERVISION_ACTIONS.GROUP_TOGGLED:
      return state.openGroupKeys.includes(action.groupKey)
        ? { openGroupKeys: state.openGroupKeys.filter((key) => key !== action.groupKey) }
        : { openGroupKeys: [...state.openGroupKeys, action.groupKey] };
  }
}
