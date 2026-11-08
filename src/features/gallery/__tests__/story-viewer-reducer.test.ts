import { STORY_VIEWER_ACTIONS, initialStoryViewerState, isStoryPaused, storyViewerReducer, type StoryViewerState } from '../story-viewer-reducer';

const OPENED = initialStoryViewerState({ dayIndex: 1, itemIndex: 2 });

function readyState(overrides: Partial<StoryViewerState> = {}): StoryViewerState {
  return { ...OPENED, mediaStatus: 'ready', ...overrides };
}

describe('storyViewerReducer', () => {
  it('opens on the tapped tile, loading and muted', () => {
    expect(OPENED).toMatchObject({ position: { dayIndex: 1, itemIndex: 2 }, mediaStatus: 'loading', muted: true, sheet: null, toast: null });
  });

  it('loads the new item and keeps the direction when moving', () => {
    const state = storyViewerReducer(readyState({ attempt: 2, videoSeconds: 42 }), {
      type: STORY_VIEWER_ACTIONS.MOVED,
      position: { dayIndex: 1, itemIndex: 1 },
      direction: -1,
    });

    expect(state).toMatchObject({ position: { dayIndex: 1, itemIndex: 1 }, direction: -1, mediaStatus: 'loading', attempt: 0, videoSeconds: null });
  });

  it('keeps the video length for the header', () => {
    const state = storyViewerReducer(readyState(), { type: STORY_VIEWER_ACTIONS.DURATION_LOADED, seconds: 42 });

    expect(state.videoSeconds).toBe(42);
  });

  it('loads again with a new attempt on retry', () => {
    const state = storyViewerReducer(readyState({ mediaStatus: 'failed', attempt: 1 }), { type: STORY_VIEWER_ACTIONS.RETRIED });

    expect(state).toMatchObject({ mediaStatus: 'loading', attempt: 2 });
  });

  it('records the media status the player reports', () => {
    const state = storyViewerReducer(readyState(), { type: STORY_VIEWER_ACTIONS.MEDIA_STATUS_CHANGED, status: 'buffering' });

    expect(state.mediaStatus).toBe('buffering');
  });

  it('toggles the sound', () => {
    const state = storyViewerReducer(readyState(), { type: STORY_VIEWER_ACTIONS.MUTE_TOGGLED });

    expect(state.muted).toBe(false);
  });

  it('opens the first-save notice', () => {
    const state = storyViewerReducer(readyState(), { type: STORY_VIEWER_ACTIONS.NOTICE_OPENED });

    expect(state.sheet).toBe('notice');
  });

  it('closes the sheet and starts saving', () => {
    const state = storyViewerReducer(readyState({ sheet: 'notice' }), { type: STORY_VIEWER_ACTIONS.SAVE_STARTED, mediaId: 'm1' });

    expect(state).toMatchObject({ sheet: null, savingId: 'm1' });
  });

  it('remembers that the notice was recorded in this session', () => {
    const state = storyViewerReducer(readyState(), { type: STORY_VIEWER_ACTIONS.NOTICE_RECORDED });

    expect(state.noticeRecorded).toBe(true);
  });

  it('marks the item saved and shows the saved toast', () => {
    const state = storyViewerReducer(readyState({ savingId: 'm1' }), { type: STORY_VIEWER_ACTIONS.SAVE_SUCCEEDED, mediaId: 'm1' });

    expect(state).toMatchObject({ savingId: null, savedIds: ['m1'], toast: 'saved' });
  });

  it('shows the failed toast when saving fails', () => {
    const state = storyViewerReducer(readyState({ savingId: 'm1' }), { type: STORY_VIEWER_ACTIONS.SAVE_FAILED });

    expect(state).toMatchObject({ savingId: null, savedIds: [], toast: 'saveFailed' });
  });

  it('opens the denied sheet when the photo permission is refused', () => {
    const state = storyViewerReducer(readyState({ savingId: 'm1' }), { type: STORY_VIEWER_ACTIONS.PERMISSION_DENIED });

    expect(state).toMatchObject({ savingId: null, sheet: 'permissionDenied' });
  });

  it('closes any sheet', () => {
    const state = storyViewerReducer(readyState({ sheet: 'permissionDenied' }), { type: STORY_VIEWER_ACTIONS.SHEET_CLOSED });

    expect(state.sheet).toBeNull();
  });

  it('hides the toast', () => {
    const state = storyViewerReducer(readyState({ toast: 'saved' }), { type: STORY_VIEWER_ACTIONS.TOAST_HIDDEN });

    expect(state.toast).toBeNull();
  });
});

describe('isStoryPaused', () => {
  it('plays a ready item with nothing over it', () => {
    expect(isStoryPaused(readyState(), false)).toBe(false);
  });

  it('pauses while a sheet is open', () => {
    expect(isStoryPaused(readyState({ sheet: 'notice' }), false)).toBe(true);
  });

  it('pauses while the item loads, buffers or failed', () => {
    expect(isStoryPaused(readyState({ mediaStatus: 'buffering' }), false)).toBe(true);
  });

  it('pauses with a screen reader on, so the person moves with the buttons', () => {
    expect(isStoryPaused(readyState(), true)).toBe(true);
  });
});
