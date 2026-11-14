import {
  DIRECTOR_GALLERY_ACTIONS,
  INITIAL_DIRECTOR_GALLERY,
  directorGalleryReducer,
  type DirectorGalleryState,
} from '../director-gallery-reducer';

const VIEWING: DirectorGalleryState = { ...INITIAL_DIRECTOR_GALLERY, openMediaId: 'media-1' };
const ASKING: DirectorGalleryState = { ...VIEWING, pendingDeleteId: 'media-1' };

describe('directorGalleryReducer', () => {
  it('starts on every room with nothing open', () => {
    expect(INITIAL_DIRECTOR_GALLERY).toEqual({ roomKey: 'all', openMediaId: null, pendingDeleteId: null, deleting: false, deleteFailed: false, toast: null, deletedIds: [] });
  });

  it('chooses a room and closes the open story', () => {
    const state = directorGalleryReducer(VIEWING, { type: DIRECTOR_GALLERY_ACTIONS.ROOM_SELECTED, roomKey: 'sala-4' });

    expect(state).toMatchObject({ roomKey: 'sala-4', openMediaId: null });
  });

  it('opens and closes a story', () => {
    const opened = directorGalleryReducer(INITIAL_DIRECTOR_GALLERY, { type: DIRECTOR_GALLERY_ACTIONS.STORY_OPENED, mediaId: 'media-1' });
    const closed = directorGalleryReducer(opened, { type: DIRECTOR_GALLERY_ACTIONS.STORY_CLOSED });

    expect([opened.openMediaId, closed.openMediaId]).toEqual(['media-1', null]);
  });

  it('asks before deleting, with no earlier failure', () => {
    const state = directorGalleryReducer({ ...VIEWING, deleteFailed: true }, { type: DIRECTOR_GALLERY_ACTIONS.DELETE_REQUESTED, mediaId: 'media-1' });

    expect(state).toMatchObject({ pendingDeleteId: 'media-1', deleteFailed: false });
  });

  it('cancels the question', () => {
    const state = directorGalleryReducer(ASKING, { type: DIRECTOR_GALLERY_ACTIONS.DELETE_CANCELLED });

    expect(state).toMatchObject({ pendingDeleteId: null, openMediaId: 'media-1' });
  });

  it('cannot cancel while deleting', () => {
    const deleting = { ...ASKING, deleting: true };

    expect(directorGalleryReducer(deleting, { type: DIRECTOR_GALLERY_ACTIONS.DELETE_CANCELLED })).toBe(deleting);
  });

  it('marks the deletion as running', () => {
    const state = directorGalleryReducer({ ...ASKING, deleteFailed: true }, { type: DIRECTOR_GALLERY_ACTIONS.DELETE_STARTED });

    expect(state).toMatchObject({ deleting: true, deleteFailed: false });
  });

  it('keeps the question open after a failure', () => {
    const state = directorGalleryReducer({ ...ASKING, deleting: true }, { type: DIRECTOR_GALLERY_ACTIONS.DELETE_FAILED });

    expect(state).toMatchObject({ pendingDeleteId: 'media-1', deleting: false, deleteFailed: true });
  });

  it('closes the story, hides the item and shows the toast once deleted', () => {
    const state = directorGalleryReducer(
      { ...ASKING, roomKey: 'sala-2', deleting: true },
      { type: DIRECTOR_GALLERY_ACTIONS.DELETED, mediaId: 'media-1', mediaType: 'video' },
    );

    expect(state).toEqual({ ...INITIAL_DIRECTOR_GALLERY, roomKey: 'sala-2', toast: 'video', deletedIds: ['media-1'] });
  });

  it('hides the toast', () => {
    const state = directorGalleryReducer({ ...INITIAL_DIRECTOR_GALLERY, toast: 'photo' }, { type: DIRECTOR_GALLERY_ACTIONS.TOAST_HIDDEN });

    expect(state.toast).toBeNull();
  });
});
