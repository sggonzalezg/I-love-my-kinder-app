export const NOTICE_DETAIL_ACTIONS = {
  IMAGE_LOADED: 'imageLoaded',
  IMAGE_FAILED: 'imageFailed',
  IMAGE_RETRIED: 'imageRetried',
  VIEWER_OPENED: 'viewerOpened',
  VIEWER_CLOSED: 'viewerClosed',
  SEEN_SHEET_OPENED: 'seenSheetOpened',
  SEEN_SHEET_CLOSED: 'seenSheetClosed',
} as const;

export type NoticeImageStatus = 'loading' | 'loaded' | 'failed';

export interface NoticeDetailState {
  image: NoticeImageStatus;
  attempt: number;
  viewerOpen: boolean;
  seenSheetOpen: boolean;
}

export type NoticeDetailAction = { type: (typeof NOTICE_DETAIL_ACTIONS)[keyof typeof NOTICE_DETAIL_ACTIONS] };

export const INITIAL_NOTICE_DETAIL_STATE: NoticeDetailState = { image: 'loading', attempt: 0, viewerOpen: false, seenSheetOpen: false };

export function noticeDetailReducer(state: NoticeDetailState, action: NoticeDetailAction): NoticeDetailState {
  switch (action.type) {
    case NOTICE_DETAIL_ACTIONS.IMAGE_LOADED:
      return { ...state, image: 'loaded' };
    case NOTICE_DETAIL_ACTIONS.IMAGE_FAILED:
      return { ...state, image: 'failed', viewerOpen: false };
    case NOTICE_DETAIL_ACTIONS.IMAGE_RETRIED:
      return { ...state, image: 'loading', attempt: state.attempt + 1 };
    case NOTICE_DETAIL_ACTIONS.VIEWER_OPENED:
      return state.image === 'loaded' ? { ...state, viewerOpen: true } : state;
    case NOTICE_DETAIL_ACTIONS.VIEWER_CLOSED:
      return { ...state, viewerOpen: false };
    case NOTICE_DETAIL_ACTIONS.SEEN_SHEET_OPENED:
      return { ...state, seenSheetOpen: true };
    case NOTICE_DETAIL_ACTIONS.SEEN_SHEET_CLOSED:
      return { ...state, seenSheetOpen: false };
  }
}
