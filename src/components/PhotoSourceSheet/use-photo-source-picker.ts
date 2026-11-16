import { useRef } from 'react';
import { Linking, Platform } from 'react-native';

import { pickChatPhoto, type ChatPhotoSource } from '@/data/chat-photos';

interface PhotoSourcePickerHandlers {
  closeSheet: () => void;
  onPicked: (localUri: string) => void;
  onCameraDenied: () => void;
}

/** Picks one photo from the source the `PhotoSourceSheet` offers, resized and stripped of EXIF as the chat photos. */
export function usePhotoSourcePicker({ closeSheet, onPicked, onCameraDenied }: PhotoSourcePickerHandlers) {
  const chosenSource = useRef<ChatPhotoSource | null>(null);

  async function launchPicker(source: ChatPhotoSource) {
    try {
      const picked = await pickChatPhoto(source);
      if (picked === 'cancelled') return;
      if (picked === 'cameraDenied') onCameraDenied();
      else onPicked(picked.uri);
    } catch (error) {
      console.warn('Picking a photo failed:', error);
    }
  }

  // iOS cannot present the picker while the source sheet is still closing, so it waits for the sheet's dismiss.
  function choose(source: ChatPhotoSource) {
    closeSheet();
    if (Platform.OS === 'ios') chosenSource.current = source;
    else launchPicker(source);
  }

  function onSourceSheetDismissed() {
    const source = chosenSource.current;
    chosenSource.current = null;
    if (source) launchPicker(source);
  }

  return { choose, onSourceSheetDismissed, openSettings: () => Linking.openSettings() };
}
