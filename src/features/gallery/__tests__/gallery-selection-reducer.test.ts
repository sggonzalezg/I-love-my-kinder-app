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

  it('opens the story viewer on the tapped tile', () => {
    const state = gallerySelectionReducer(INITIAL_GALLERY_SELECTION, { type: GALLERY_SELECTION_ACTIONS.STORY_OPENED, mediaId: 'm1' });

    expect(state.openMediaId).toBe('m1');
  });

  it('closes the story viewer when another group is picked', () => {
    const state = gallerySelectionReducer({ selectedKey: 'a', openMediaId: 'm1' }, { type: GALLERY_SELECTION_ACTIONS.GROUP_SELECTED, key: 'b' });

    expect(state.openMediaId).toBeNull();
  });

  it('closes the story viewer', () => {
    const state = gallerySelectionReducer({ selectedKey: null, openMediaId: 'm1' }, { type: GALLERY_SELECTION_ACTIONS.STORY_CLOSED });

    expect(state.openMediaId).toBeNull();
  });
});
