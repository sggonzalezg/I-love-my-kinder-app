import * as Haptics from 'expo-haptics';
import { useEffect, useReducer } from 'react';

import { TOAST_VISIBLE_MS } from '@/components/toast';
import { deleteNurseryMedia, fetchNurseryMedia, fetchNurseryRooms } from '@/data/director-gallery';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { roomChipsOf, type DirectorGalleryMedia, type RoomChip } from '@/lib/director-gallery';

import { DIRECTOR_GALLERY_ACTIONS, INITIAL_DIRECTOR_GALLERY, directorGalleryReducer, type DirectorGalleryAction, type DirectorGalleryState } from './director-gallery-reducer';

export interface DirectorGallery {
  state: DirectorGalleryState;
  dispatch: (action: DirectorGalleryAction) => void;
  chips: RoomChip[];
  media: DirectorGalleryMedia[] | null;
  loading: boolean;
  failed: boolean;
  reload: () => void;
  confirmDelete: () => void;
}

export function useDirectorGallery(): DirectorGallery {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const [state, dispatch] = useReducer(directorGalleryReducer, INITIAL_DIRECTOR_GALLERY);

  const rooms = useAsync(() => fetchNurseryRooms(nurseryId!), nurseryId);
  const media = useAsync(() => fetchNurseryMedia(nurseryId!, state.roomKey), nurseryId ? `${nurseryId}:${state.roomKey}` : null, { keepDataOnReload: true });
  useReloadOnRefocus(media.reload);

  useEffect(() => {
    if (!state.toast) return;
    const timer = setTimeout(() => dispatch({ type: DIRECTOR_GALLERY_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.toast]);

  async function confirmDelete() {
    const target = media.data?.find((item) => item.id === state.pendingDeleteId);
    if (!target || state.deleting) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: DIRECTOR_GALLERY_ACTIONS.DELETE_STARTED });
    try {
      await deleteNurseryMedia(target);
      dispatch({ type: DIRECTOR_GALLERY_ACTIONS.DELETED, mediaId: target.id, mediaType: target.type });
      media.reload();
    } catch (error) {
      console.warn('Media delete failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: DIRECTOR_GALLERY_ACTIONS.DELETE_FAILED });
    }
  }

  function reload() {
    rooms.reload();
    media.reload();
  }

  return {
    state,
    dispatch,
    chips: roomChipsOf(rooms.data ?? []),
    media: media.data?.filter((item) => !state.deletedIds.includes(item.id)) ?? null,
    loading: media.loading && media.data === null,
    failed: media.failed || rooms.failed,
    reload,
    confirmDelete: () => void confirmDelete(),
  };
}
