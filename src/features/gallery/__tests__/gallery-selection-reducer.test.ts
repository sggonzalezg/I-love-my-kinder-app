import { GALLERY_SELECTION_ACTIONS, INITIAL_GALLERY_SELECTION, gallerySelectionReducer } from '../gallery-selection-reducer';

describe('gallerySelectionReducer', () => {
  it('starts with no group picked, so the first one shows', () => {
    expect(INITIAL_GALLERY_SELECTION.selectedKey).toBeNull();
  });

  it('remembers the group the family picks', () => {
    const state = gallerySelectionReducer(INITIAL_GALLERY_SELECTION, {
      type: GALLERY_SELECTION_ACTIONS.GROUP_SELECTED,
      key: 'sala-1:morning-id',
    });

    expect(state.selectedKey).toBe('sala-1:morning-id');
  });
});
