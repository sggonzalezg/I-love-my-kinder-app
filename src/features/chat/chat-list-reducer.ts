import { ALL_CHATS_FILTER_KEY } from '@/lib/chat-filters';

export interface ChatListState {
  filterKey: string;
}

export const INITIAL_CHAT_LIST_STATE: ChatListState = { filterKey: ALL_CHATS_FILTER_KEY };

export const CHAT_LIST_ACTIONS = {
  FILTER_SELECTED: 'filterSelected',
} as const;

export type ChatListAction = { type: typeof CHAT_LIST_ACTIONS.FILTER_SELECTED; key: string };

export function chatListReducer(state: ChatListState, action: ChatListAction): ChatListState {
  switch (action.type) {
    case CHAT_LIST_ACTIONS.FILTER_SELECTED:
      return { ...state, filterKey: action.key };
  }
}
