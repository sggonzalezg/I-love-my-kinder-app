import { messageKey, type ChatMessage, type ChatRead } from '@/lib/chat';

export type MessageStatus = 'sent' | 'sending' | 'failed';

export interface DisplayedMessage extends ChatMessage {
  status: MessageStatus;
  /** The photo on the phone, shown while its message is sending or failed. */
  localImageUri?: string;
}

export interface PendingMessage {
  clientId: string;
  body: string | null;
  imagePath: string | null;
  localImageUri: string | null;
  createdAt: string;
  status: Exclude<MessageStatus, 'sent'>;
}

export interface ChatAttachment {
  localUri: string;
  path: string;
  progress: number;
  status: 'uploading' | 'uploaded' | 'failed';
}

export interface ChatThreadState {
  messages: ChatMessage[];
  reads: ChatRead[];
  /** Messages already there when the chat opened do not animate in; null until the first load. */
  keysOnOpen: string[] | null;
  pending: PendingMessage[];
  draft: string;
  attachment: ChatAttachment | null;
  photoSourceOpen: boolean;
  cameraDenied: boolean;
  viewerKey: string | null;
  membersOpen: boolean;
}

export const INITIAL_CHAT_THREAD_STATE: ChatThreadState = {
  messages: [],
  reads: [],
  keysOnOpen: null,
  pending: [],
  draft: '',
  attachment: null,
  photoSourceOpen: false,
  cameraDenied: false,
  viewerKey: null,
  membersOpen: false,
};

export const CHAT_THREAD_ACTIONS = {
  MESSAGES_LOADED: 'messagesLoaded',
  MESSAGE_RECEIVED: 'messageReceived',
  READS_LOADED: 'readsLoaded',
  DRAFT_CHANGED: 'draftChanged',
  SEND_STARTED: 'sendStarted',
  SEND_SUCCEEDED: 'sendSucceeded',
  SEND_FAILED: 'sendFailed',
  RETRY_STARTED: 'retryStarted',
  PHOTO_SOURCE_OPENED: 'photoSourceOpened',
  PHOTO_SOURCE_CLOSED: 'photoSourceClosed',
  CAMERA_DENIED: 'cameraDenied',
  ATTACHMENT_PICKED: 'attachmentPicked',
  ATTACHMENT_PROGRESS: 'attachmentProgress',
  ATTACHMENT_UPLOADED: 'attachmentUploaded',
  ATTACHMENT_FAILED: 'attachmentFailed',
  ATTACHMENT_RETRIED: 'attachmentRetried',
  ATTACHMENT_REMOVED: 'attachmentRemoved',
  VIEWER_OPENED: 'viewerOpened',
  VIEWER_CLOSED: 'viewerClosed',
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
  | { type: typeof CHAT_THREAD_ACTIONS.PHOTO_SOURCE_OPENED }
  | { type: typeof CHAT_THREAD_ACTIONS.PHOTO_SOURCE_CLOSED }
  | { type: typeof CHAT_THREAD_ACTIONS.CAMERA_DENIED }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_PICKED; localUri: string; path: string }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_PROGRESS; path: string; progress: number }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_UPLOADED; path: string }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_FAILED; path: string }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_RETRIED }
  | { type: typeof CHAT_THREAD_ACTIONS.ATTACHMENT_REMOVED }
  | { type: typeof CHAT_THREAD_ACTIONS.VIEWER_OPENED; key: string }
  | { type: typeof CHAT_THREAD_ACTIONS.VIEWER_CLOSED }
  | { type: typeof CHAT_THREAD_ACTIONS.MEMBERS_OPENED }
  | { type: typeof CHAT_THREAD_ACTIONS.MEMBERS_CLOSED };

export function isNewSinceOpen(state: ChatThreadState, key: string): boolean {
  return state.keysOnOpen !== null && !state.keysOnOpen.includes(key);
}

/** A photo goes only once uploaded ("Enviar" is off while it uploads); without a photo, text is needed. */
export function canSend(state: ChatThreadState): boolean {
  if (state.attachment) return state.attachment.status === 'uploaded';
  return state.draft.trim().length > 0;
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

/** Upload events of a photo the person already removed or replaced are ignored. */
function withAttachment(state: ChatThreadState, path: string, change: Partial<ChatAttachment>): ChatThreadState {
  if (state.attachment?.path !== path) return state;
  return { ...state, attachment: { ...state.attachment, ...change } };
}

function withSendStarted(state: ChatThreadState, action: Extract<ChatThreadAction, { type: typeof CHAT_THREAD_ACTIONS.SEND_STARTED }>): ChatThreadState {
  const photo = state.attachment?.status === 'uploaded' ? state.attachment : null;
  const pending: PendingMessage = {
    clientId: action.clientId,
    body: action.body || null,
    imagePath: photo?.path ?? null,
    localImageUri: photo?.localUri ?? null,
    createdAt: action.createdAt,
    status: 'sending',
  };
  return { ...state, draft: '', attachment: null, pending: [...state.pending, pending] };
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
      return withSendStarted(state, action);
    case CHAT_THREAD_ACTIONS.SEND_FAILED:
      return withPendingStatus(state, action.clientId, 'failed');
    case CHAT_THREAD_ACTIONS.RETRY_STARTED:
      return withPendingStatus(state, action.clientId, 'sending');
    case CHAT_THREAD_ACTIONS.PHOTO_SOURCE_OPENED:
      return { ...state, photoSourceOpen: true, cameraDenied: false };
    case CHAT_THREAD_ACTIONS.PHOTO_SOURCE_CLOSED:
      return { ...state, photoSourceOpen: false };
    case CHAT_THREAD_ACTIONS.CAMERA_DENIED:
      return { ...state, photoSourceOpen: false, cameraDenied: true };
    case CHAT_THREAD_ACTIONS.ATTACHMENT_PICKED:
      return {
        ...state,
        photoSourceOpen: false,
        cameraDenied: false,
        attachment: { localUri: action.localUri, path: action.path, progress: 0, status: 'uploading' },
      };
    case CHAT_THREAD_ACTIONS.ATTACHMENT_PROGRESS:
      return withAttachment(state, action.path, { progress: action.progress });
    case CHAT_THREAD_ACTIONS.ATTACHMENT_UPLOADED:
      return withAttachment(state, action.path, { progress: 1, status: 'uploaded' });
    case CHAT_THREAD_ACTIONS.ATTACHMENT_FAILED:
      return withAttachment(state, action.path, { status: 'failed' });
    case CHAT_THREAD_ACTIONS.ATTACHMENT_RETRIED:
      return state.attachment ? { ...state, attachment: { ...state.attachment, progress: 0, status: 'uploading' } } : state;
    case CHAT_THREAD_ACTIONS.ATTACHMENT_REMOVED:
      return { ...state, attachment: null };
    case CHAT_THREAD_ACTIONS.VIEWER_OPENED:
      return { ...state, viewerKey: action.key };
    case CHAT_THREAD_ACTIONS.VIEWER_CLOSED:
      return { ...state, viewerKey: null };
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
    imagePath: message.imagePath,
    localImageUri: message.localImageUri ?? undefined,
    createdAt: message.createdAt,
    status: message.status,
  }));
  return [...saved, ...pending].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}
