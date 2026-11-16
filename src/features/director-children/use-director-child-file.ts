import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useReducer } from 'react';

import { usePhotoSourcePicker } from '@/components/PhotoSourceSheet/use-photo-source-picker';
import { childGroupFormHref, childPersonFormHref } from '@/constants/routes';
import { fetchChildAuthorizations } from '@/data/child-authorizations';
import { fetchChildEnrollments } from '@/data/child-enrollments';
import { fetchChildPeople } from '@/data/child-people';
import { fetchDirectorChildFile, replaceChildPhoto, updateChildColumns } from '@/data/director-child-file';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { useReloadOnRefocus } from '@/data/use-reload-on-refocus';
import { CHILD_FILE_ACTIONS, INITIAL_CHILD_FILE_STATE, childFileReducer } from '@/features/director-children/child-file-reducer';
import type { PersonKind } from '@/lib/child-people';
import {
  changedChildColumns,
  childFileErrors,
  initialChildFileValues,
  type ChildFileErrors,
  type ChildFileField,
  type ChildFilePart,
} from '@/lib/director-child-file';
import { hasErrors } from '@/lib/new-child-form';

const NO_ERRORS: ChildFileErrors = {};

export function useDirectorChildFile(childId: string) {
  const file = useAsync(() => fetchDirectorChildFile(childId), childId);
  const people = useAsync(() => fetchChildPeople(childId), childId, { keepDataOnReload: true });
  useReloadOnRefocus(people.reload);
  const authorizations = useAsync(() => fetchChildAuthorizations(childId), childId, { keepDataOnReload: true });
  useReloadOnRefocus(authorizations.reload);
  const enrollments = useAsync(() => fetchChildEnrollments(childId), childId, { keepDataOnReload: true });
  useReloadOnRefocus(enrollments.reload);
  const [state, dispatch] = useReducer(childFileReducer, INITIAL_CHILD_FILE_STATE);
  useFocusEffect(useCallback(() => () => dispatch({ type: CHILD_FILE_ACTIONS.NATIONAL_IDS_HIDDEN }), []));
  const child = file.data;
  const values = child ? { ...initialChildFileValues(child), ...state.edits } : null;
  const errors = values ? childFileErrors(state.part, values, new Date()) : NO_ERRORS;
  const shownErrors = state.showErrors ? errors : NO_ERRORS;
  const { session } = useSession();
  const photoPath = state.photo.savedPath ?? child?.photoPath ?? null;

  async function uploadPhoto(localUri: string) {
    if (!child || !session) return;
    dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_STARTED });
    try {
      const path = await replaceChildPhoto({ nurseryId: session.nursery_id, childId: child.id, localUri, previousPath: photoPath });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_SAVED, path });
    } catch (error) {
      console.warn('Child photo change failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_UPLOAD_FAILED });
    }
  }

  const photoPicker = usePhotoSourcePicker({
    closeSheet: () => dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_CLOSED }),
    onPicked: uploadPhoto,
    onCameraDenied: () => dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_CAMERA_DENIED }),
  });

  async function save() {
    if (!child || !values) return;
    if (hasErrors(errors)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: CHILD_FILE_ACTIONS.SUBMIT_REFUSED });
      return;
    }
    const columns = changedChildColumns(state.part, child, values);
    if (!hasErrors(columns)) {
      router.back();
      return;
    }
    dispatch({ type: CHILD_FILE_ACTIONS.SAVE_STARTED });
    try {
      await updateChildColumns(child.id, columns);
    } catch (error) {
      console.warn('Child file save failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: CHILD_FILE_ACTIONS.SAVE_FAILED });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return {
    child,
    values,
    part: state.part,
    saving: state.status === 'saving',
    saveFailed: state.saveFailed,
    loading: file.loading,
    failed: file.failed,
    reload: file.reload,
    fieldError: (field: ChildFileField) => shownErrors[field] ?? null,
    choosePart: (part: ChildFilePart) => dispatch({ type: CHILD_FILE_ACTIONS.PART_CHOSEN, part }),
    change: (field: ChildFileField, value: string) => dispatch({ type: CHILD_FILE_ACTIONS.FIELD_CHANGED, field, value }),
    save,
    people: {
      lists: people.data,
      failed: people.failed,
      reload: people.reload,
      revealedIds: state.revealedIds,
      toggleNationalId: (personId: string) => dispatch({ type: CHILD_FILE_ACTIONS.NATIONAL_ID_TOGGLED, personId }),
      edit: (kind: PersonKind, personId: string) => router.push(childPersonFormHref(childId, kind, personId)),
      add: (kind: PersonKind) => router.push(childPersonFormHref(childId, kind)),
    },
    authorizations: {
      list: authorizations.data,
      failed: authorizations.failed,
      reload: authorizations.reload,
    },
    enrollments: {
      list: enrollments.data,
      failed: enrollments.failed,
      reload: enrollments.reload,
      change: (enrollmentId: string) => router.push(childGroupFormHref(childId, enrollmentId)),
      enroll: () => router.push(childGroupFormHref(childId)),
    },
    photo: {
      path: photoPath,
      sourceOpen: state.photo.sourceOpen,
      uploading: state.photo.status === 'uploading',
      failed: state.photo.status === 'failed',
      cameraDenied: state.photo.cameraDenied,
      open: () => dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_OPENED }),
      close: () => dispatch({ type: CHILD_FILE_ACTIONS.PHOTO_SOURCE_CLOSED }),
      ...photoPicker,
    },
  };
}
