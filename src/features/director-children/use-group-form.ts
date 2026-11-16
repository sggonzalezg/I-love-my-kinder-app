import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { fetchGroupFormData, saveGroupWrite } from '@/data/child-enrollments';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { GROUP_FORM_ACTIONS, INITIAL_GROUP_FORM_STATE, groupFormReducer } from '@/features/director-children/group-form-reducer';
import {
  changeGroupChoices,
  enrollGroupChoices,
  enrollmentSaveMessage,
  groupFormErrors,
  groupWrite,
  initialGroupValues,
  type GroupFormErrors,
  type GroupFormField,
} from '@/lib/child-enrollments';
import { hasErrors } from '@/lib/new-child-form';

const NO_ERRORS: GroupFormErrors = {};

/** Without `enrollmentId` the form enrolls the child in another group; with it, it changes that group. */
export function useGroupForm(childId: string, enrollmentId: string | null) {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const data = useAsync(() => fetchGroupFormData(nurseryId!, childId), nurseryId && `${childId}:${enrollmentId}`);
  const [state, dispatch] = useReducer(groupFormReducer, INITIAL_GROUP_FORM_STATE);

  const loaded = data.data;
  const changing = (enrollmentId && loaded?.enrollments.find((enrollment) => enrollment.id === enrollmentId)) || null;
  const notFound = Boolean(loaded && enrollmentId && !changing);
  const choices = loaded
    ? enrollmentId
      ? changeGroupChoices(loaded.rooms, loaded.shifts)
      : enrollGroupChoices(loaded.rooms, loaded.shifts, loaded.enrollments)
    : { rooms: [], shifts: [] };
  const values = { ...initialGroupValues(choices, changing), ...state.edits };
  const errors = groupFormErrors(values);
  const shownErrors = state.showErrors ? errors : NO_ERRORS;

  async function save() {
    if (!nurseryId || !loaded) return;
    if (hasErrors(errors)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: GROUP_FORM_ACTIONS.SUBMIT_REFUSED });
      return;
    }
    const write = groupWrite(nurseryId, childId, changing, values);
    if (write.kind === 'none') {
      router.back();
      return;
    }
    dispatch({ type: GROUP_FORM_ACTIONS.SAVE_STARTED });
    try {
      await saveGroupWrite(write);
    } catch (error) {
      console.warn('Child group save failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: GROUP_FORM_ACTIONS.SAVE_FAILED, message: enrollmentSaveMessage(error instanceof Error ? error.message : '') });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return {
    values,
    choices,
    loading: data.loading,
    failed: data.failed,
    notFound,
    reload: data.reload,
    saving: state.status === 'saving',
    saveError: state.saveError,
    fieldError: (field: GroupFormField) => shownErrors[field] ?? null,
    change: (field: GroupFormField, value: string) => dispatch({ type: GROUP_FORM_ACTIONS.FIELD_CHANGED, field, value }),
    save,
  };
}
