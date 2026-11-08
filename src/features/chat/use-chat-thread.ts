import * as Haptics from 'expo-haptics';
import { useEffect, useReducer } from 'react';
import { AppState } from 'react-native';

import { fetchThreadMessages, fetchThreadReads, markThreadRead, newClientId, sendChatMessage, subscribeToThreadMessages } from '@/data/chat';
import { useAsync } from '@/data/use-async';

import { CHAT_THREAD_ACTIONS, INITIAL_CHAT_THREAD_STATE, canSend, chatThreadReducer, type PendingMessage } from './chat-thread-reducer';

function markRead(threadId: string, userId: string) {
  markThreadRead(threadId, userId).catch((error: unknown) => console.warn('Marking the chat as read failed:', error));
}

/** Messages, reads, live inserts and sending for one room chat; the chat has no offline queue (design F13). */
export function useChatThread(threadId: string, userId: string) {
  const [state, dispatch] = useReducer(chatThreadReducer, INITIAL_CHAT_THREAD_STATE);
  const messages = useAsync(() => fetchThreadMessages(threadId), threadId);
  const reads = useAsync(() => fetchThreadReads(threadId), threadId);
  const { reload: reloadMessages } = messages;
  const { reload: reloadReads } = reads;

  useEffect(() => {
    if (messages.data) dispatch({ type: CHAT_THREAD_ACTIONS.MESSAGES_LOADED, messages: messages.data });
  }, [messages.data]);

  useEffect(() => {
    if (reads.data) dispatch({ type: CHAT_THREAD_ACTIONS.READS_LOADED, reads: reads.data });
  }, [reads.data]);

  useEffect(() => {
    markRead(threadId, userId);
    return subscribeToThreadMessages(threadId, (message) => {
      dispatch({ type: CHAT_THREAD_ACTIONS.MESSAGE_RECEIVED, message });
      markRead(threadId, userId);
    });
  }, [threadId, userId]);

  // Realtime may miss inserts while the app sleeps, so coming back reloads.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (appState) => {
      if (appState !== 'active') return;
      reloadMessages();
      reloadReads();
      markRead(threadId, userId);
    });
    return () => subscription.remove();
  }, [threadId, userId, reloadMessages, reloadReads]);

  async function deliver({ clientId, body, imagePath }: Pick<PendingMessage, 'clientId' | 'body' | 'imagePath'>) {
    try {
      const saved = await sendChatMessage({ threadId, body, imagePath, clientId });
      dispatch({ type: CHAT_THREAD_ACTIONS.SEND_SUCCEEDED, message: saved });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      markRead(threadId, userId);
      reloadReads();
    } catch (error) {
      console.warn('Sending the chat message failed:', error);
      dispatch({ type: CHAT_THREAD_ACTIONS.SEND_FAILED, clientId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function send() {
    if (!canSend(state)) return;
    const body = state.draft.trim();
    const clientId = newClientId(userId);
    dispatch({ type: CHAT_THREAD_ACTIONS.SEND_STARTED, clientId, body, createdAt: new Date().toISOString() });
    deliver({ clientId, body: body || null, imagePath: state.attachment?.path ?? null });
  }

  function retry(clientId: string) {
    const failed = state.pending.find((pending) => pending.clientId === clientId);
    if (!failed) return;
    dispatch({ type: CHAT_THREAD_ACTIONS.RETRY_STARTED, clientId });
    deliver(failed);
  }

  return {
    state,
    dispatch,
    send,
    retry,
    loading: messages.loading && state.messages.length === 0,
    loadFailed: messages.failed,
    reload: reloadMessages,
  };
}
