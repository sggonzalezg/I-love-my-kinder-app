export interface ChatNoticeState {
  checked: boolean;
  saving: boolean;
  failed: boolean;
}

export const INITIAL_CHAT_NOTICE_STATE: ChatNoticeState = { checked: false, saving: false, failed: false };

export const CHAT_NOTICE_ACTIONS = {
  TOGGLED: 'toggled',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type ChatNoticeAction =
  | { type: typeof CHAT_NOTICE_ACTIONS.TOGGLED }
  | { type: typeof CHAT_NOTICE_ACTIONS.SAVE_STARTED }
  | { type: typeof CHAT_NOTICE_ACTIONS.SAVE_FAILED };

export function chatNoticeReducer(state: ChatNoticeState, action: ChatNoticeAction): ChatNoticeState {
  switch (action.type) {
    case CHAT_NOTICE_ACTIONS.TOGGLED:
      return { ...state, checked: !state.checked };
    case CHAT_NOTICE_ACTIONS.SAVE_STARTED:
      return { ...state, saving: true, failed: false };
    case CHAT_NOTICE_ACTIONS.SAVE_FAILED:
      return { ...state, saving: false, failed: true };
  }
}
