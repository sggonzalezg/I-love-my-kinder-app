import { INITIAL_NOTICE_DETAIL_STATE, NOTICE_DETAIL_ACTIONS, noticeDetailReducer } from '@/features/notices/notice-detail-reducer';

describe('noticeDetailReducer', () => {
  it('starts loading the image with the viewer closed', () => {
    expect(INITIAL_NOTICE_DETAIL_STATE).toEqual({ image: 'loading', attempt: 0, viewerOpen: false, seenSheetOpen: false });
  });

  it('marks the image loaded', () => {
    const state = noticeDetailReducer(INITIAL_NOTICE_DETAIL_STATE, { type: NOTICE_DETAIL_ACTIONS.IMAGE_LOADED });

    expect(state.image).toBe('loaded');
  });

  it('marks the image failed', () => {
    const state = noticeDetailReducer(INITIAL_NOTICE_DETAIL_STATE, { type: NOTICE_DETAIL_ACTIONS.IMAGE_FAILED });

    expect(state.image).toBe('failed');
  });

  it('loads the image again with a new attempt on retry', () => {
    const failed = { ...INITIAL_NOTICE_DETAIL_STATE, image: 'failed' as const };

    const state = noticeDetailReducer(failed, { type: NOTICE_DETAIL_ACTIONS.IMAGE_RETRIED });

    expect(state).toEqual({ image: 'loading', attempt: 1, viewerOpen: false, seenSheetOpen: false });
  });

  it('opens the viewer once the image is loaded', () => {
    const loaded = { ...INITIAL_NOTICE_DETAIL_STATE, image: 'loaded' as const };

    const state = noticeDetailReducer(loaded, { type: NOTICE_DETAIL_ACTIONS.VIEWER_OPENED });

    expect(state.viewerOpen).toBe(true);
  });

  it('keeps the viewer closed while the image is not loaded', () => {
    const state = noticeDetailReducer(INITIAL_NOTICE_DETAIL_STATE, { type: NOTICE_DETAIL_ACTIONS.VIEWER_OPENED });

    expect(state.viewerOpen).toBe(false);
  });

  it('closes the viewer', () => {
    const open = { ...INITIAL_NOTICE_DETAIL_STATE, image: 'loaded' as const, viewerOpen: true };

    const state = noticeDetailReducer(open, { type: NOTICE_DETAIL_ACTIONS.VIEWER_CLOSED });

    expect(state.viewerOpen).toBe(false);
  });

  it('opens the sheet of who saw the notice', () => {
    const state = noticeDetailReducer(INITIAL_NOTICE_DETAIL_STATE, { type: NOTICE_DETAIL_ACTIONS.SEEN_SHEET_OPENED });

    expect(state.seenSheetOpen).toBe(true);
  });

  it('closes the sheet of who saw the notice', () => {
    const open = { ...INITIAL_NOTICE_DETAIL_STATE, seenSheetOpen: true };

    const state = noticeDetailReducer(open, { type: NOTICE_DETAIL_ACTIONS.SEEN_SHEET_CLOSED });

    expect(state.seenSheetOpen).toBe(false);
  });
});
