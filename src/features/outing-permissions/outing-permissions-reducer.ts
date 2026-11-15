import type { PermissionFilter } from '@/lib/outing-permissions';

export const OUTING_PERMISSIONS_ACTIONS = {
  FILTER_CHOSEN: 'filterChosen',
} as const;

/** `chosenFilter` stays null until the teacher picks one, so the screen opens on the filter the answers call for. */
export interface OutingPermissionsState {
  chosenFilter: PermissionFilter | null;
}

export type OutingPermissionsAction = { type: typeof OUTING_PERMISSIONS_ACTIONS.FILTER_CHOSEN; filter: PermissionFilter };

export const INITIAL_OUTING_PERMISSIONS_STATE: OutingPermissionsState = { chosenFilter: null };

export function outingPermissionsReducer(state: OutingPermissionsState, action: OutingPermissionsAction): OutingPermissionsState {
  switch (action.type) {
    case OUTING_PERMISSIONS_ACTIONS.FILTER_CHOSEN:
      return { ...state, chosenFilter: action.filter };
  }
}

export function shownFilter(state: OutingPermissionsState, initialFilter: PermissionFilter): PermissionFilter {
  return state.chosenFilter ?? initialFilter;
}
