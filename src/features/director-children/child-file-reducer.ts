import { CHILD_FILE_PARTS, type ChildFileField, type ChildFilePart, type ChildFileValues } from '@/lib/director-child-file';

export type ChildFileStatus = 'editing' | 'saving';

export interface ChildFileState {
  part: ChildFilePart;
  edits: Partial<ChildFileValues>;
  status: ChildFileStatus;
  showErrors: boolean;
  saveFailed: boolean;
}

export const CHILD_FILE_ACTIONS = {
  PART_CHOSEN: 'partChosen',
  FIELD_CHANGED: 'fieldChanged',
  SUBMIT_REFUSED: 'submitRefused',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type ChildFileAction =
  | { type: typeof CHILD_FILE_ACTIONS.PART_CHOSEN; part: ChildFilePart }
  | { type: typeof CHILD_FILE_ACTIONS.FIELD_CHANGED; field: ChildFileField; value: string }
  | { type: typeof CHILD_FILE_ACTIONS.SUBMIT_REFUSED }
  | { type: typeof CHILD_FILE_ACTIONS.SAVE_STARTED }
  | { type: typeof CHILD_FILE_ACTIONS.SAVE_FAILED };

export const INITIAL_CHILD_FILE_STATE: ChildFileState = {
  part: CHILD_FILE_PARTS.data,
  edits: {},
  status: 'editing',
  showErrors: false,
  saveFailed: false,
};

export function childFileReducer(state: ChildFileState, action: ChildFileAction): ChildFileState {
  switch (action.type) {
    case CHILD_FILE_ACTIONS.PART_CHOSEN:
      if (state.status === 'saving') return state;
      return { ...state, part: action.part, showErrors: false, saveFailed: false };
    case CHILD_FILE_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { ...state, edits: { ...state.edits, [action.field]: action.value }, saveFailed: false };
    case CHILD_FILE_ACTIONS.SUBMIT_REFUSED:
      return { ...state, showErrors: true };
    case CHILD_FILE_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving', showErrors: true, saveFailed: false };
    case CHILD_FILE_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'editing', saveFailed: true };
  }
}
