import type { PickedMedia } from '@/lib/gallery-upload';

export const TEACHER_UPLOAD_ACTIONS = {
  MEDIA_PICKED: 'mediaPicked',
  PICK_REMOVED: 'pickRemoved',
  GROUP_TOGGLED: 'groupToggled',
  UPLOAD_STARTED: 'uploadStarted',
  CAMERA_DENIED: 'cameraDenied',
} as const;

export interface TeacherUploadState {
  picks: PickedMedia[];
  /** Null until the teacher touches a checkbox: the screen's default groups apply until then. */
  checkedGroupKeys: string[] | null;
  cameraDenied: boolean;
}

export type TeacherUploadAction =
  | { type: typeof TEACHER_UPLOAD_ACTIONS.MEDIA_PICKED; picks: PickedMedia[] }
  | { type: typeof TEACHER_UPLOAD_ACTIONS.PICK_REMOVED; id: string }
  | { type: typeof TEACHER_UPLOAD_ACTIONS.GROUP_TOGGLED; groupKey: string; defaultGroupKeys: string[] }
  | { type: typeof TEACHER_UPLOAD_ACTIONS.UPLOAD_STARTED }
  | { type: typeof TEACHER_UPLOAD_ACTIONS.CAMERA_DENIED };

export const INITIAL_TEACHER_UPLOAD_STATE: TeacherUploadState = { picks: [], checkedGroupKeys: null, cameraDenied: false };

export function checkedGroupKeysOf(state: TeacherUploadState, defaultGroupKeys: string[]): string[] {
  return state.checkedGroupKeys ?? defaultGroupKeys;
}

export function teacherUploadReducer(state: TeacherUploadState, action: TeacherUploadAction): TeacherUploadState {
  switch (action.type) {
    case TEACHER_UPLOAD_ACTIONS.MEDIA_PICKED:
      return { ...state, picks: [...state.picks, ...action.picks], cameraDenied: false };
    case TEACHER_UPLOAD_ACTIONS.PICK_REMOVED:
      return { ...state, picks: state.picks.filter((pick) => pick.id !== action.id) };
    case TEACHER_UPLOAD_ACTIONS.GROUP_TOGGLED: {
      const checked = checkedGroupKeysOf(state, action.defaultGroupKeys);
      const next = checked.includes(action.groupKey) ? checked.filter((key) => key !== action.groupKey) : [...checked, action.groupKey];
      return { ...state, checkedGroupKeys: next };
    }
    case TEACHER_UPLOAD_ACTIONS.UPLOAD_STARTED:
      return { ...state, picks: [] };
    case TEACHER_UPLOAD_ACTIONS.CAMERA_DENIED:
      return { ...state, cameraDenied: true };
  }
}
