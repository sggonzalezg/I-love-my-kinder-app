import type { StoryPosition } from '@/lib/story';

export type StoryMediaStatus = 'loading' | 'ready' | 'buffering' | 'failed';
export type StorySheet = 'notice' | 'permissionDenied';
export type StoryToast = 'saved' | 'saveFailed';
export type StoryDirection = 1 | -1;

export interface StoryViewerState {
  position: StoryPosition;
  direction: StoryDirection;
  mediaStatus: StoryMediaStatus;
  attempt: number;
  videoSeconds: number | null;
  muted: boolean;
  noticeRecorded: boolean;
  savingId: string | null;
  savedIds: string[];
  sheet: StorySheet | null;
  toast: StoryToast | null;
}

export function initialStoryViewerState(position: StoryPosition): StoryViewerState {
  return {
    position,
    direction: 1,
    mediaStatus: 'loading',
    attempt: 0,
    videoSeconds: null,
    muted: true,
    noticeRecorded: false,
    savingId: null,
    savedIds: [],
    sheet: null,
    toast: null,
  };
}

export const STORY_VIEWER_ACTIONS = {
  MOVED: 'moved',
  MEDIA_STATUS_CHANGED: 'mediaStatusChanged',
  RETRIED: 'retried',
  DURATION_LOADED: 'durationLoaded',
  MUTE_TOGGLED: 'muteToggled',
  NOTICE_OPENED: 'noticeOpened',
  NOTICE_RECORDED: 'noticeRecorded',
  SAVE_STARTED: 'saveStarted',
  SAVE_SUCCEEDED: 'saveSucceeded',
  SAVE_FAILED: 'saveFailed',
  PERMISSION_DENIED: 'permissionDenied',
  SHEET_CLOSED: 'sheetClosed',
  TOAST_HIDDEN: 'toastHidden',
} as const;

export type StoryViewerAction =
  | { type: typeof STORY_VIEWER_ACTIONS.MOVED; position: StoryPosition; direction: StoryDirection }
  | { type: typeof STORY_VIEWER_ACTIONS.MEDIA_STATUS_CHANGED; status: StoryMediaStatus }
  | { type: typeof STORY_VIEWER_ACTIONS.RETRIED }
  | { type: typeof STORY_VIEWER_ACTIONS.DURATION_LOADED; seconds: number }
  | { type: typeof STORY_VIEWER_ACTIONS.MUTE_TOGGLED }
  | { type: typeof STORY_VIEWER_ACTIONS.NOTICE_OPENED }
  | { type: typeof STORY_VIEWER_ACTIONS.NOTICE_RECORDED }
  | { type: typeof STORY_VIEWER_ACTIONS.SAVE_STARTED; mediaId: string }
  | { type: typeof STORY_VIEWER_ACTIONS.SAVE_SUCCEEDED; mediaId: string }
  | { type: typeof STORY_VIEWER_ACTIONS.SAVE_FAILED }
  | { type: typeof STORY_VIEWER_ACTIONS.PERMISSION_DENIED }
  | { type: typeof STORY_VIEWER_ACTIONS.SHEET_CLOSED }
  | { type: typeof STORY_VIEWER_ACTIONS.TOAST_HIDDEN };

export function storyViewerReducer(state: StoryViewerState, action: StoryViewerAction): StoryViewerState {
  switch (action.type) {
    case STORY_VIEWER_ACTIONS.MOVED:
      return { ...state, position: action.position, direction: action.direction, mediaStatus: 'loading', attempt: 0, videoSeconds: null };
    case STORY_VIEWER_ACTIONS.MEDIA_STATUS_CHANGED:
      return { ...state, mediaStatus: action.status };
    case STORY_VIEWER_ACTIONS.RETRIED:
      return { ...state, mediaStatus: 'loading', attempt: state.attempt + 1 };
    case STORY_VIEWER_ACTIONS.DURATION_LOADED:
      return { ...state, videoSeconds: action.seconds };
    case STORY_VIEWER_ACTIONS.MUTE_TOGGLED:
      return { ...state, muted: !state.muted };
    case STORY_VIEWER_ACTIONS.NOTICE_OPENED:
      return { ...state, sheet: 'notice' };
    case STORY_VIEWER_ACTIONS.NOTICE_RECORDED:
      return { ...state, noticeRecorded: true };
    case STORY_VIEWER_ACTIONS.SAVE_STARTED:
      return { ...state, sheet: null, savingId: action.mediaId };
    case STORY_VIEWER_ACTIONS.SAVE_SUCCEEDED:
      return { ...state, savingId: null, savedIds: [...state.savedIds, action.mediaId], toast: 'saved' };
    case STORY_VIEWER_ACTIONS.SAVE_FAILED:
      return { ...state, savingId: null, toast: 'saveFailed' };
    case STORY_VIEWER_ACTIONS.PERMISSION_DENIED:
      return { ...state, savingId: null, sheet: 'permissionDenied' };
    case STORY_VIEWER_ACTIONS.SHEET_CLOSED:
      return { ...state, sheet: null };
    case STORY_VIEWER_ACTIONS.TOAST_HIDDEN:
      return { ...state, toast: null };
  }
}

/** Auto-advance stops while something covers the story, while it is not playing, or with a screen reader (WCAG 2.2.2). */
export function isStoryPaused(state: StoryViewerState, screenReaderOn: boolean): boolean {
  return state.sheet !== null || state.mediaStatus !== 'ready' || screenReaderOn;
}
