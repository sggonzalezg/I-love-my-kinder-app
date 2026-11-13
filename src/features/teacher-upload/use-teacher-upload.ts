import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import { useEffect, useReducer } from 'react';
import { Linking } from 'react-native';

import type { ChatPhotoSource } from '@/data/chat-photos';
import { pickGalleryMedia } from '@/data/gallery-upload';
import { queueUploads, retryUpload, useGalleryUploadQueue } from '@/data/gallery-upload-store';
import { useSession } from '@/data/session';
import { fetchTeacherGroups, type TeacherGroup } from '@/data/teacher-day';
import { useAsync } from '@/data/use-async';
import { groupKeyOf } from '@/features/teacher-day/use-group-day';
import { remainingUploadCount, uploadablePicks, type UploadItem } from '@/lib/gallery-upload';
import { defaultGroupIndex } from '@/lib/teacher-day';

import { checkedGroupKeysOf, INITIAL_TEACHER_UPLOAD_STATE, TEACHER_UPLOAD_ACTIONS, teacherUploadReducer } from './teacher-upload-reducer';

// Only the group of the current shift starts checked: a file sent to the wrong group is seen by other families.
function defaultGroupKeys(groups: TeacherGroup[]): string[] {
  const group = groups[defaultGroupIndex(groups, new Date())];
  return group ? [groupKeyOf(group)] : [];
}

export function useTeacherUpload() {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const nurseryId = session?.nursery_id ?? null;
  const navigation = useNavigation();
  const groupsLoad = useAsync(() => fetchTeacherGroups(userId!), userId);
  const [state, dispatch] = useReducer(teacherUploadReducer, INITIAL_TEACHER_UPLOAD_STATE);
  const queue = useGalleryUploadQueue();

  const groups = groupsLoad.data ?? [];
  const defaults = defaultGroupKeys(groups);
  const checkedKeys = checkedGroupKeysOf(state, defaults);
  const checkedGroups = groups.filter((group) => checkedKeys.includes(groupKeyOf(group)));
  const uploadable = uploadablePicks(state.picks);
  const remaining = remainingUploadCount(queue);

  useEffect(() => {
    navigation.setOptions({ tabBarBadge: remaining || undefined });
  }, [navigation, remaining]);

  async function pick(source: ChatPhotoSource) {
    try {
      const picked = await pickGalleryMedia(source);
      if (picked === 'cancelled') return;
      if (picked === 'cameraDenied') dispatch({ type: TEACHER_UPLOAD_ACTIONS.CAMERA_DENIED });
      else dispatch({ type: TEACHER_UPLOAD_ACTIONS.MEDIA_PICKED, picks: picked });
    } catch (error) {
      console.warn('Picking gallery media failed:', error);
    }
  }

  function startUpload() {
    if (!userId || !nurseryId || !uploadable.length || !checkedGroups.length) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const items: UploadItem[] = uploadable.map((media) => ({
      ...media,
      nurseryId,
      uploaderId: userId,
      groups: checkedGroups,
      preparedUri: null,
      coverUri: null,
      status: 'queued',
      progress: 0,
    }));
    dispatch({ type: TEACHER_UPLOAD_ACTIONS.UPLOAD_STARTED });
    queueUploads(items);
  }

  return {
    state,
    groups,
    groupsLoading: groupsLoad.loading,
    groupsFailed: groupsLoad.failed,
    reloadGroups: groupsLoad.reload,
    checkedKeys,
    checkedGroupCount: checkedGroups.length,
    uploadableCount: uploadable.length,
    queue,
    pick,
    startUpload,
    retry: retryUpload,
    removePick: (id: string) => dispatch({ type: TEACHER_UPLOAD_ACTIONS.PICK_REMOVED, id }),
    toggleGroup: (groupKey: string) => dispatch({ type: TEACHER_UPLOAD_ACTIONS.GROUP_TOGGLED, groupKey, defaultGroupKeys: defaults }),
    openSettings: () => Linking.openSettings(),
  };
}
