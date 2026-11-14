import { useRef, type Dispatch } from 'react';
import { Linking, Platform } from 'react-native';

import { pickChatPhoto, type ChatPhotoSource } from '@/data/chat-photos';
import { EVENT_FORM_ACTIONS, type EventFormAction } from '@/features/calendar/event-form-reducer';

/** Picks the event's one image, resized and stripped of EXIF as the chat photos; it uploads only on save. */
export function useEventImagePicker(dispatch: Dispatch<EventFormAction>) {
  const chosenSource = useRef<ChatPhotoSource | null>(null);

  async function launchPicker(source: ChatPhotoSource) {
    try {
      const picked = await pickChatPhoto(source);
      if (picked === 'cancelled') return;
      if (picked === 'cameraDenied') dispatch({ type: EVENT_FORM_ACTIONS.CAMERA_DENIED });
      else dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_PICKED, uri: picked.uri });
    } catch (error) {
      console.warn('Picking the event image failed:', error);
    }
  }

  // iOS cannot present the picker while the source sheet is still closing, so it waits for the sheet's dismiss.
  function choose(source: ChatPhotoSource) {
    dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_CLOSED });
    if (Platform.OS === 'ios') chosenSource.current = source;
    else launchPicker(source);
  }

  function onSourceSheetDismissed() {
    const source = chosenSource.current;
    chosenSource.current = null;
    if (source) launchPicker(source);
  }

  return {
    open: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_OPENED }),
    close: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_SOURCE_CLOSED }),
    remove: () => dispatch({ type: EVENT_FORM_ACTIONS.IMAGE_REMOVED }),
    choose,
    onSourceSheetDismissed,
    openSettings: () => Linking.openSettings(),
  };
}
