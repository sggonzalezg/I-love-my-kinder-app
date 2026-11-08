export interface GallerySelectionState {
  selectedKey: string | null;
  openMediaId: string | null;
}

export const INITIAL_GALLERY_SELECTION: GallerySelectionState = { selectedKey: null, openMediaId: null };

export const GALLERY_SELECTION_ACTIONS = {
  GROUP_SELECTED: 'groupSelected',
  STORY_OPENED: 'storyOpened',
  STORY_CLOSED: 'storyClosed',
} as const;

export type GallerySelectionAction =
  | { type: typeof GALLERY_SELECTION_ACTIONS.GROUP_SELECTED; key: string }
  | { type: typeof GALLERY_SELECTION_ACTIONS.STORY_OPENED; mediaId: string }
  | { type: typeof GALLERY_SELECTION_ACTIONS.STORY_CLOSED };

export function gallerySelectionReducer(state: GallerySelectionState, action: GallerySelectionAction): GallerySelectionState {
  switch (action.type) {
    case GALLERY_SELECTION_ACTIONS.GROUP_SELECTED:
      return { ...state, selectedKey: action.key, openMediaId: null };
    case GALLERY_SELECTION_ACTIONS.STORY_OPENED:
      return { ...state, openMediaId: action.mediaId };
    case GALLERY_SELECTION_ACTIONS.STORY_CLOSED:
      return { ...state, openMediaId: null };
  }
}
