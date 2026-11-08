import type { ChatMessage } from '@/lib/chat';

import { CHAT_THREAD_ACTIONS, INITIAL_CHAT_THREAD_STATE, chatThreadReducer, displayedMessages, isNewSinceOpen } from '../chat-thread-reducer';

const ME = 'user-me';

function message(overrides: Partial<ChatMessage>): ChatMessage {
  return {
    id: 'm1',
    clientId: null,
    threadId: 't1',
    senderId: 'user-other',
    senderRole: 'teacher',
    senderLabel: 'Sofía Martínez',
    body: 'Hola',
    imagePath: null,
    createdAt: '2026-11-07T10:00:00.000Z',
    ...overrides,
  };
}

const sending = {
  type: CHAT_THREAD_ACTIONS.SEND_STARTED,
  clientId: 'c1',
  body: 'Mateo trae las semillas',
  createdAt: '2026-11-07T10:05:00.000Z',
} as const;

describe('chatThreadReducer', () => {
  it('keeps what the person types', () => {
    const state = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.DRAFT_CHANGED, text: 'Hola' });

    expect(state.draft).toBe('Hola');
  });

  it('shows a sent message at once as sending and clears the input', () => {
    const typed = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.DRAFT_CHANGED, text: 'Mateo trae las semillas' });
    const state = chatThreadReducer(typed, sending);

    expect(state.draft).toBe('');
    expect(displayedMessages(state, ME)).toEqual([expect.objectContaining({ id: 'c1', senderId: ME, body: 'Mateo trae las semillas', status: 'sending' })]);
  });

  it('marks a message that could not be sent as failed', () => {
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, sending), { type: CHAT_THREAD_ACTIONS.SEND_FAILED, clientId: 'c1' });

    expect(displayedMessages(state, ME)[0].status).toBe('failed');
  });

  it('sends a failed message again', () => {
    const failed = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, sending), { type: CHAT_THREAD_ACTIONS.SEND_FAILED, clientId: 'c1' });
    const state = chatThreadReducer(failed, { type: CHAT_THREAD_ACTIONS.RETRY_STARTED, clientId: 'c1' });

    expect(displayedMessages(state, ME)[0].status).toBe('sending');
  });

  it('replaces the sending bubble with the saved message', () => {
    const saved = message({ id: 'server-1', clientId: 'c1', senderId: ME, body: 'Mateo trae las semillas' });
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, sending), { type: CHAT_THREAD_ACTIONS.SEND_SUCCEEDED, message: saved });

    expect(displayedMessages(state, ME)).toEqual([{ ...saved, status: 'sent' }]);
  });

  it('does not duplicate a message that arrives live and from the reload', () => {
    const live = message({ id: 'm2', createdAt: '2026-11-07T10:10:00.000Z' });
    const received = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.MESSAGE_RECEIVED, message: live });
    const state = chatThreadReducer(received, { type: CHAT_THREAD_ACTIONS.MESSAGES_LOADED, messages: [message({ id: 'm1' }), live] });

    expect(displayedMessages(state, ME).map((shown) => shown.id)).toEqual(['m1', 'm2']);
  });

  it('drops the sending bubble when its own message arrives live first', () => {
    const own = message({ id: 'server-1', clientId: 'c1', senderId: ME });
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, sending), { type: CHAT_THREAD_ACTIONS.MESSAGE_RECEIVED, message: own });

    expect(displayedMessages(state, ME)).toHaveLength(1);
  });

  it('does not animate the messages that were there when the chat opened', () => {
    const opened = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.MESSAGES_LOADED, messages: [message({ id: 'm1' })] });
    const reloaded = chatThreadReducer(opened, { type: CHAT_THREAD_ACTIONS.MESSAGES_LOADED, messages: [message({ id: 'm1' }), message({ id: 'm2' })] });

    expect([isNewSinceOpen(reloaded, 'm1'), isNewSinceOpen(reloaded, 'm2')]).toEqual([false, true]);
  });

  it('animates nothing before the first load', () => {
    expect(isNewSinceOpen(INITIAL_CHAT_THREAD_STATE, 'm1')).toBe(false);
  });

  it('keeps the latest reads for "Visto por"', () => {
    const reads = [{ userId: 'a', lastReadAt: '2026-11-07T10:00:00.000Z' }];
    const state = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.READS_LOADED, reads });

    expect(state.reads).toEqual(reads);
  });

  it('opens and closes the members sheet', () => {
    const opened = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.MEMBERS_OPENED });
    const closed = chatThreadReducer(opened, { type: CHAT_THREAD_ACTIONS.MEMBERS_CLOSED });

    expect([opened.membersOpen, closed.membersOpen]).toEqual([true, false]);
  });
});
