export const CHILD_FILE_ACTIONS = {
  NATIONAL_ID_TOGGLED: 'nationalIdToggled',
  NATIONAL_IDS_HIDDEN: 'nationalIdsHidden',
} as const;

export interface ChildFileState {
  revealedIds: string[];
}

export type ChildFileAction =
  | { type: typeof CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED; personId: string }
  | { type: typeof CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN };

export const INITIAL_CHILD_FILE_STATE: ChildFileState = { revealedIds: [] };

export function childFileReducer(state: ChildFileState, action: ChildFileAction): ChildFileState {
  switch (action.type) {
    case CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED:
      return state.revealedIds.includes(action.personId)
        ? { revealedIds: state.revealedIds.filter((id) => id !== action.personId) }
        : { revealedIds: [...state.revealedIds, action.personId] };
    case CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN:
      return state.revealedIds.length ? INITIAL_CHILD_FILE_STATE : state;
  }
}
