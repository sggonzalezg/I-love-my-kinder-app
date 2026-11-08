import * as Haptics from 'expo-haptics';
import type { Dispatch } from 'react';
import { Linking } from 'react-native';

import { fetchNoticeNeeded, recordConsent } from '@/data/consent';
import { saveMediaToDevice } from '@/data/save-media';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { SAVE_MEDIA_NOTICE } from '@/legal/texts';
import type { GalleryMedia } from '@/lib/gallery';

import { STORY_SCREEN } from './story-copy';
import { STORY_VIEWER_ACTIONS, type StoryViewerAction, type StoryViewerState } from './story-viewer-reducer';

function failed(dispatch: Dispatch<StoryViewerAction>, error: unknown) {
  console.warn('Saving story media failed:', error);
  dispatch({ type: STORY_VIEWER_ACTIONS.SAVE_FAILED });
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/** "Guardar": the one-time family-use notice (recorded), then the add-only permission, then the copy. */
export function useStorySave(media: GalleryMedia, state: StoryViewerState, dispatch: Dispatch<StoryViewerAction>) {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const notice = useAsync(() => fetchNoticeNeeded(userId!, SAVE_MEDIA_NOTICE), userId);
  // Until the check answers (or if it fails), the notice shows: asking twice is safer than not asking.
  const noticeNeeded = !state.noticeRecorded && notice.data !== false;

  async function saveCurrent() {
    dispatch({ type: STORY_VIEWER_ACTIONS.SAVE_STARTED, mediaId: media.id });
    try {
      const result = await saveMediaToDevice(media);
      if (result === 'permissionDenied') {
        dispatch({ type: STORY_VIEWER_ACTIONS.PERMISSION_DENIED });
        return;
      }
      dispatch({ type: STORY_VIEWER_ACTIONS.SAVE_SUCCEEDED, mediaId: media.id });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      failed(dispatch, error);
    }
  }

  function requestSave() {
    if (noticeNeeded) dispatch({ type: STORY_VIEWER_ACTIONS.NOTICE_OPENED });
    else saveCurrent();
  }

  async function acceptNotice() {
    dispatch({ type: STORY_VIEWER_ACTIONS.SAVE_STARTED, mediaId: media.id });
    try {
      await recordConsent({ documentId: SAVE_MEDIA_NOTICE.id, version: SAVE_MEDIA_NOTICE.version, accepted: true, screen: STORY_SCREEN });
    } catch (error) {
      failed(dispatch, error);
      return;
    }
    dispatch({ type: STORY_VIEWER_ACTIONS.NOTICE_RECORDED });
    await saveCurrent();
  }

  function openSettings() {
    dispatch({ type: STORY_VIEWER_ACTIONS.SHEET_CLOSED });
    Linking.openSettings();
  }

  return { requestSave, acceptNotice, openSettings };
}
