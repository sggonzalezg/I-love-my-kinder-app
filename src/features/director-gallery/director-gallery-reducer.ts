import { ALL_ROOMS_KEY } from '@/lib/director-gallery';
import type { GalleryMediaType } from '@/lib/gallery';

export interface DirectorGalleryState {
  roomKey: string;
  openMediaId: string | null;
  pendingDeleteId: string | null;
  deleting: boolean;
  deleteFailed: boolean;
  toast: GalleryMediaType | null;
  /** Hidden at once, before the reload that no longer returns them arrives. */
  deletedIds: string[];
}

export const INITIAL_DIRECTOR_GALLERY: DirectorGalleryState = {
  roomKey: ALL_ROOMS_KEY,
  openMediaId: null,
  pendingDeleteId: null,
  deleting: false,
  deleteFailed: false,
  toast: null,
  deletedIds: [],
};

export const DIRECTOR_GALLERY_ACTIONS = {
  ROOM_SELECTED: 'roomSelected',
  STORY_OPENED: 'storyOpened',
  STORY_CLOSED: 'storyClosed',
  DELETE_REQUESTED: 'deleteRequested',
  DELETE_CANCELLED: 'deleteCancelled',
  DELETE_STARTED: 'deleteStarted',
  DELETE_FAILED: 'deleteFailed',
  DELETED: 'deleted',
  TOAST_HIDDEN: 'toastHidden',
} as const;

export type DirectorGalleryAction =
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.ROOM_SELECTED; roomKey: string }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.STORY_OPENED; mediaId: string }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.STORY_CLOSED }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.DELETE_REQUESTED; mediaId: string }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.DELETE_CANCELLED }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.DELETE_STARTED }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.DELETE_FAILED }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.DELETED; mediaId: string; mediaType: GalleryMediaType }
  | { type: typeof DIRECTOR_GALLERY_ACTIONS.TOAST_HIDDEN };

export function directorGalleryReducer(state: DirectorGalleryState, action: DirectorGalleryAction): DirectorGalleryState {
  switch (action.type) {
    case DIRECTOR_GALLERY_ACTIONS.ROOM_SELECTED:
      return { ...state, roomKey: action.roomKey, openMediaId: null };
    case DIRECTOR_GALLERY_ACTIONS.STORY_OPENED:
      return { ...state, openMediaId: action.mediaId };
    case DIRECTOR_GALLERY_ACTIONS.STORY_CLOSED:
      return { ...state, openMediaId: null };
    case DIRECTOR_GALLERY_ACTIONS.DELETE_REQUESTED:
      return { ...state, pendingDeleteId: action.mediaId, deleteFailed: false };
    case DIRECTOR_GALLERY_ACTIONS.DELETE_CANCELLED:
      return state.deleting ? state : { ...state, pendingDeleteId: null, deleteFailed: false };
    case DIRECTOR_GALLERY_ACTIONS.DELETE_STARTED:
      return { ...state, deleting: true, deleteFailed: false };
    case DIRECTOR_GALLERY_ACTIONS.DELETE_FAILED:
      return { ...state, deleting: false, deleteFailed: true };
    case DIRECTOR_GALLERY_ACTIONS.DELETED:
      return {
        ...state,
        openMediaId: null,
        pendingDeleteId: null,
        deleting: false,
        toast: action.mediaType,
        deletedIds: [...state.deletedIds, action.mediaId],
      };
    case DIRECTOR_GALLERY_ACTIONS.TOAST_HIDDEN:
      return { ...state, toast: null };
  }
}
