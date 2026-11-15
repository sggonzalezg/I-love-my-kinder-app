export interface SheetGroup {
  roomId: string;
  shiftId: string;
  label: string;
}

export type GroupTeachersStatus = 'editing' | 'saving' | 'failed';

export interface GroupTeachersState {
  group: SheetGroup | null;
  toggledIds: string[];
  status: GroupTeachersStatus;
  openCount: number;
}

export const INITIAL_GROUP_TEACHERS_STATE: GroupTeachersState = { group: null, toggledIds: [], status: 'editing', openCount: 0 };

export const GROUP_TEACHERS_ACTIONS = {
  OPENED: 'opened',
  TOGGLED: 'toggled',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
  CLOSED: 'closed',
} as const;

export type GroupTeachersAction =
  | { type: typeof GROUP_TEACHERS_ACTIONS.OPENED; group: SheetGroup }
  | { type: typeof GROUP_TEACHERS_ACTIONS.TOGGLED; teacherId: string }
  | { type: typeof GROUP_TEACHERS_ACTIONS.SAVE_STARTED }
  | { type: typeof GROUP_TEACHERS_ACTIONS.SAVE_FAILED }
  | { type: typeof GROUP_TEACHERS_ACTIONS.CLOSED };

export function groupTeachersReducer(state: GroupTeachersState, action: GroupTeachersAction): GroupTeachersState {
  switch (action.type) {
    case GROUP_TEACHERS_ACTIONS.OPENED:
      return { group: action.group, toggledIds: [], status: 'editing', openCount: state.openCount + 1 };
    case GROUP_TEACHERS_ACTIONS.TOGGLED:
      if (state.status === 'saving') return state;
      return {
        ...state,
        toggledIds: state.toggledIds.includes(action.teacherId) ? state.toggledIds.filter((id) => id !== action.teacherId) : [...state.toggledIds, action.teacherId],
      };
    case GROUP_TEACHERS_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving' };
    case GROUP_TEACHERS_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'failed' };
    case GROUP_TEACHERS_ACTIONS.CLOSED:
      return { ...INITIAL_GROUP_TEACHERS_STATE, openCount: state.openCount };
  }
}
