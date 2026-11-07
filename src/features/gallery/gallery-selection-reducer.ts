export interface GallerySelectionState {
  selectedKey: string | null;
}

export const INITIAL_GALLERY_SELECTION: GallerySelectionState = { selectedKey: null };

export const GALLERY_SELECTION_ACTIONS = {
  GROUP_SELECTED: 'groupSelected',
} as const;

export type GallerySelectionAction = { type: typeof GALLERY_SELECTION_ACTIONS.GROUP_SELECTED; key: string };

export function gallerySelectionReducer(state: GallerySelectionState, action: GallerySelectionAction): GallerySelectionState {
  switch (action.type) {
    case GALLERY_SELECTION_ACTIONS.GROUP_SELECTED:
      return { ...state, selectedKey: action.key };
  }
}
