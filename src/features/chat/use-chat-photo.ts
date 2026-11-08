import type { Dispatch } from 'react';
import { useRef } from 'react';
import { Linking, Platform } from 'react-native';

import { newChatPhotoId, pickChatPhoto, uploadChatPhoto, type ChatPhotoSource } from '@/data/chat-photos';
import { chatImagePath } from '@/lib/chat-photo';

import { CHAT_THREAD_ACTIONS, type ChatThreadAction, type ChatThreadState } from './chat-thread-reducer';

interface ChatPhotoTarget {
  nurseryId: string;
  threadId: string;
}

/** Picking, preparing and uploading the one photo a message can carry; the upload starts as soon as it is picked. */
export function useChatPhoto(state: ChatThreadState, dispatch: Dispatch<ChatThreadAction>, { nurseryId, threadId }: ChatPhotoTarget) {
  const chosenSource = useRef<ChatPhotoSource | null>(null);

  async function upload(localUri: string, path: string) {
    try {
      await uploadChatPhoto(localUri, path, (progress) => dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_PROGRESS, path, progress }));
      dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_UPLOADED, path });
    } catch (error) {
      console.warn('Uploading the chat photo failed:', error);
      dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_FAILED, path });
    }
  }

  async function launchPicker(source: ChatPhotoSource) {
    try {
      const picked = await pickChatPhoto(source);
      if (picked === 'cancelled') return;
      if (picked === 'cameraDenied') {
        dispatch({ type: CHAT_THREAD_ACTIONS.CAMERA_DENIED });
        return;
      }
      const path = chatImagePath(nurseryId, threadId, newChatPhotoId());
      dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_PICKED, localUri: picked.uri, path });
      upload(picked.uri, path);
    } catch (error) {
      console.warn('Picking the chat photo failed:', error);
    }
  }

  // iOS cannot present the picker while the source sheet is still closing, so it waits for the sheet's dismiss.
  function choose(source: ChatPhotoSource) {
    dispatch({ type: CHAT_THREAD_ACTIONS.PHOTO_SOURCE_CLOSED });
    if (Platform.OS === 'ios') chosenSource.current = source;
    else launchPicker(source);
  }

  function onSourceSheetDismissed() {
    const source = chosenSource.current;
    chosenSource.current = null;
    if (source) launchPicker(source);
  }

  function retryUpload() {
    const { attachment } = state;
    if (!attachment) return;
    dispatch({ type: CHAT_THREAD_ACTIONS.ATTACHMENT_RETRIED });
    upload(attachment.localUri, attachment.path);
  }

  return {
    choose,
    onSourceSheetDismissed,
    retryUpload,
    openSettings: () => Linking.openSettings(),
  };
}
