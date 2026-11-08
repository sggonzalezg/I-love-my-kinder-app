import { messageKey, type ChatMessage, type ChatRead } from '@/lib/chat';

export type MessageStatus = 'sent' | 'sending' | 'failed';

export interface DisplayedMessage extends ChatMessage {
  status: MessageStatus;
}

interface PendingMessage {
  clientId: string;
  body: string;
  createdAt: string;
  status: Exclude<MessageStatus, 'sent'>;
}

export interface ChatThreadState {
  messages: ChatMessage[];
  reads: ChatRead[];
  /** Messages already there when the chat opened do not animate in; null until the first load. */
  keysOnOpen: string[] | null;
  pending: PendingMessage[];
  draft: string;
  membersOpen: boolean;
}

export const INITIAL_CHAT_THREAD_STATE: ChatThreadState = { messages: [], reads: [], keysOnOpen: null, pending: [], draft: '', membersOpen: false };

export const CHAT_THREAD_ACTIONS = {
  MESSAGES_LOADED: 'messagesLoaded',
  MESSAGE_RECEIVED: 'messageReceived',
  READS_LOADED: 'readsLoaded',
  DRAFT_CHANGED: 'draftChanged',
  SEND_STARTED: 'sendStarted',
  SEND_SUCCEEDED: 'sendSucceeded',
  SEND_FAILED: 'sendFailed',
  RETRY_STARTED: 'retryStarted',
  MEMBERS_OPENED: 'membersOpened',
  MEMBERS_CLOSED: 'membersClosed',
} as const;

export type ChatThreadAction =
  | { type: typeof CHAT_THREAD_ACTIONS.MESSAGES_LOADED; messages: ChatMessage[] }
  | { type: typeof CHAT_THREAD_ACTIONS.MESSAGE_RECEIVED; message: ChatMessage }
  | { type: typeof CHAT_THREAD_ACTIONS.READS_LOADED; reads: ChatRead[] }
  | { type: typeof CHAT_THREAD_ACTIONS.DRAFT_CHANGED; text: string }
  | { type: typeof CHAT_THREAD_ACTIONS.SEND_STARTED; clientId: string; body: string; createdAt: string }
  | { type: typeof CHAT_THREAD_ACTIONS.SEND_SUCCEEDED; message: ChatMessage }
  | { type: typeof CHAT_THREAD_ACTIONS.SEND_FAILED; clientId: string }
  | { type: typeof CHAT_THREAD_ACTIONS.RETRY_STARTED; clientId: string }
  | { type: typeof CHAT_THREAD_ACTIONS.MEMBERS_OPENED }
  | { type: typeof CHAT_THREAD_ACTIONS.MEMBERS_CLOSED };

export function isNewSinceOpen(state: ChatThreadState, key: string): boolean {
  return state.keysOnOpen !== null && !state.keysOnOpen.includes(key);
}

/** Messages are unique by id, and a saved message replaces the sending bubble with its client id. */
function withMessages(state: ChatThreadState, incoming: ChatMessage[]): ChatThreadState {
  const byId = new Map(state.messages.map((message) => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  const savedClientIds = new Set(incoming.map((message) => message.clientId));
  return { ...state, messages: [...byId.values()], pending: state.pending.filter((pending) => !savedClientIds.has(pending.clientId)) };
}

function withPendingStatus(state: ChatThreadState, clientId: string, status: PendingMessage['status']): ChatThreadState {
  return { ...state, pending: state.pending.map((pending) => (pending.clientId === clientId ? { ...pending, status } : pending)) };
}

export function chatThreadReducer(state: ChatThreadState, action: ChatThreadAction): ChatThreadState {
  switch (action.type) {
    case CHAT_THREAD_ACTIONS.MESSAGES_LOADED:
      return {
        ...withMessages(state, action.messages),
        keysOnOpen: state.keysOnOpen ?? action.messages.map(messageKey),
      };
    case CHAT_THREAD_ACTIONS.MESSAGE_RECEIVED:
    case CHAT_THREAD_ACTIONS.SEND_SUCCEEDED:
      return withMessages(state, [action.message]);
    case CHAT_THREAD_ACTIONS.READS_LOADED:
      return { ...state, reads: action.reads };
    case CHAT_THREAD_ACTIONS.DRAFT_CHANGED:
      return { ...state, draft: action.text };
    case CHAT_THREAD_ACTIONS.SEND_STARTED:
      return {
        ...state,
        draft: '',
        pending: [...state.pending, { clientId: action.clientId, body: action.body, createdAt: action.createdAt, status: 'sending' }],
      };
    case CHAT_THREAD_ACTIONS.SEND_FAILED:
      return withPendingStatus(state, action.clientId, 'failed');
    case CHAT_THREAD_ACTIONS.RETRY_STARTED:
      return withPendingStatus(state, action.clientId, 'sending');
    case CHAT_THREAD_ACTIONS.MEMBERS_OPENED:
      return { ...state, membersOpen: true };
    case CHAT_THREAD_ACTIONS.MEMBERS_CLOSED:
      return { ...state, membersOpen: false };
  }
}

export function displayedMessages(state: ChatThreadState, userId: string): DisplayedMessage[] {
  const saved: DisplayedMessage[] = state.messages.map((message) => ({ ...message, status: 'sent' }));
  const pending: DisplayedMessage[] = state.pending.map((message) => ({
    id: message.clientId,
    clientId: message.clientId,
    threadId: '',
    senderId: userId,
    senderRole: 'family',
    senderLabel: '',
    body: message.body,
    imagePath: null,
    createdAt: message.createdAt,
    status: message.status,
  }));
  return [...saved, ...pending].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}
