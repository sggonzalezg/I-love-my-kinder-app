import { CHILD_FILE_PARTS, type ChildFileField, type ChildFilePart, type ChildFileValues } from '@/lib/director-child-file';

export type ChildFileStatus = 'editing' | 'saving';
export type ChildPhotoStatus = 'idle' | 'uploading' | 'failed';

/** `savedPath` is the photo uploaded on this screen; null means the one the file loaded with. */
export interface ChildPhotoState {
  sourceOpen: boolean;
  status: ChildPhotoStatus;
  cameraDenied: boolean;
  savedPath: string | null;
}

export interface ChildFileState {
  part: ChildFilePart;
  edits: Partial<ChildFileValues>;
  status: ChildFileStatus;
  showErrors: boolean;
  saveFailed: boolean;
  photo: ChildPhotoState;
}

export const CHILD_FILE_ACTIONS = {
  PART_CHOSEN: 'partChosen',
  FIELD_CHANGED: 'fieldChanged',
  SUBMIT_REFUSED: 'submitRefused',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
  PHOTO_SOURCE_OPENED: 'photoSourceOpened',
  PHOTO_SOURCE_CLOSED: 'photoSourceClosed',
  PHOTO_CAMERA_DENIED: 'photoCameraDenied',
  PHOTO_UPLOAD_STARTED: 'photoUploadStarted',
  PHOTO_UPLOAD_FAILED: 'photoUploadFailed',
  PHOTO_SAVED: 'photoSaved',
} as const;

export type ChildFileAction =
  | { type: typeof CHILD_FILE_ACTIONS.PART_CHOSEN; part: ChildFilePart }
  | { type: typeof CHILD_FILE_ACTIONS.FIELD_CHANGED; field: ChildFileField; value: string }
  | { type: typeof CHILD_FILE_ACTIONS.SUBMIT_REFUSED }
  | { type: typeof CHILD_FILE_ACTIONS.SAVE_STARTED }
  | { type: typeof CHILD_FILE_ACTIONS.SAVE_FAILED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_SOURCE_CLOSED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_CAMERA_DENIED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED }
  | { type: typeof CHILD_FILE_ACTIONS.PHOTO_SAVED; path: string };

export const INITIAL_CHILD_FILE_STATE: ChildFileState = {
  part: CHILD_FILE_PARTS.data,
  edits: {},
  status: 'editing',
  showErrors: false,
  saveFailed: false,
  photo: { sourceOpen: false, status: 'idle', cameraDenied: false, savedPath: null },
};

function withPhoto(state: ChildFileState, photo: Partial<ChildPhotoState>): ChildFileState {
  return { ...state, photo: { ...state.photo, ...photo } };
}

export function childFileReducer(state: ChildFileState, action: ChildFileAction): ChildFileState {
  switch (action.type) {
    case CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED:
      if (state.status === 'saving' || state.photo.status === 'uploading') return state;
      return withPhoto(state, { sourceOpen: true, status: 'idle', cameraDenied: false });
    case CHILD_FILE_ACTIONS.PHOTO_SOURCE_CLOSED:
      return withPhoto(state, { sourceOpen: false });
    case CHILD_FILE_ACTIONS.PHOTO_CAMERA_DENIED:
      return withPhoto(state, { cameraDenied: true });
    case CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED:
      return withPhoto(state, { status: 'uploading', cameraDenied: false });
    case CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED:
      return withPhoto(state, { status: 'failed' });
    case CHILD_FILE_ACTIONS.PHOTO_SAVED:
      return withPhoto(state, { status: 'idle', savedPath: action.path });
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
