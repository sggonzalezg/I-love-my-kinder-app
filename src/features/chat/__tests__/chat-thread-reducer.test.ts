import type { ChatMessage } from '@/lib/chat';

import { CHAT_THREAD_ACTIONS, INITIAL_CHAT_THREAD_STATE, canSend, chatThreadReducer, displayedMessages, isNewSinceOpen } from '../chat-thread-reducer';

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

describe('chatThreadReducer with a photo', () => {
  const picked = { type: CHAT_THREAD_ACTIONS.ATTACHMENT_PICKED, localUri: 'file:///photo.jpg', path: 'n1/t1/f1.jpg' } as const;
  const uploaded = { type: CHAT_THREAD_ACTIONS.ATTACHMENT_UPLOADED, path: 'n1/t1/f1.jpg' } as const;

  it('starts uploading a picked photo and closes the source sheet', () => {
    const opened = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.PHOTO_SOURCE_OPENED });
    const state = chatThreadReducer(opened, picked);

    expect([state.attachment, state.photoSourceOpen]).toEqual([{ localUri: 'file:///photo.jpg', path: 'n1/t1/f1.jpg', progress: 0, status: 'uploading' }, false]);
  });

  it('follows the upload progress of the current photo only', () => {
    const progressed = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), {
      type: CHAT_THREAD_ACTIONS.ATTACHMENT_PROGRESS,
      path: 'n1/t1/f1.jpg',
      progress: 0.6,
    });
    const stale = chatThreadReducer(progressed, { type: CHAT_THREAD_ACTIONS.ATTACHMENT_PROGRESS, path: 'n1/t1/old.jpg', progress: 0.9 });

    expect(stale.attachment?.progress).toBe(0.6);
  });

  it('does not let a message go while the photo uploads', () => {
    const typed = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), { type: CHAT_THREAD_ACTIONS.DRAFT_CHANGED, text: 'Hola' });

    expect(canSend(typed)).toBe(false);
  });

  it('lets an uploaded photo go without text', () => {
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), uploaded);

    expect(canSend(state)).toBe(true);
  });

  it('does not let a message go with a photo that failed to upload', () => {
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), { type: CHAT_THREAD_ACTIONS.ATTACHMENT_FAILED, path: 'n1/t1/f1.jpg' });

    expect([state.attachment?.status, canSend(state)]).toEqual(['failed', false]);
  });

  it('uploads a failed photo again from zero', () => {
    const failed = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), { type: CHAT_THREAD_ACTIONS.ATTACHMENT_FAILED, path: 'n1/t1/f1.jpg' });
    const state = chatThreadReducer(failed, { type: CHAT_THREAD_ACTIONS.ATTACHMENT_RETRIED });

    expect([state.attachment?.status, state.attachment?.progress]).toEqual(['uploading', 0]);
  });

  it('removes the photo', () => {
    const state = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), { type: CHAT_THREAD_ACTIONS.ATTACHMENT_REMOVED });

    expect(state.attachment).toBeNull();
  });

  it('sends the photo in the bubble at once and clears the composer', () => {
    const ready = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), uploaded);
    const state = chatThreadReducer(ready, { ...sending, body: '' });

    expect([state.attachment, displayedMessages(state, ME)[0]]).toEqual([
      null,
      expect.objectContaining({ body: null, imagePath: 'n1/t1/f1.jpg', localImageUri: 'file:///photo.jpg', status: 'sending' }),
    ]);
  });

  it('keeps the photo of a message that failed so the retry sends it', () => {
    const ready = chatThreadReducer(chatThreadReducer(INITIAL_CHAT_THREAD_STATE, picked), uploaded);
    const failed = chatThreadReducer(chatThreadReducer(ready, sending), { type: CHAT_THREAD_ACTIONS.SEND_FAILED, clientId: 'c1' });

    expect(failed.pending[0]).toEqual(expect.objectContaining({ imagePath: 'n1/t1/f1.jpg', status: 'failed' }));
  });

  it('remembers a refused camera until the next pick', () => {
    const denied = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.CAMERA_DENIED });
    const state = chatThreadReducer(denied, picked);

    expect([denied.cameraDenied, state.cameraDenied]).toEqual([true, false]);
  });

  it('opens and closes the photo viewer', () => {
    const opened = chatThreadReducer(INITIAL_CHAT_THREAD_STATE, { type: CHAT_THREAD_ACTIONS.VIEWER_OPENED, key: 'm1' });
    const closed = chatThreadReducer(opened, { type: CHAT_THREAD_ACTIONS.VIEWER_CLOSED });

    expect([opened.viewerKey, closed.viewerKey]).toEqual(['m1', null]);
  });
});
