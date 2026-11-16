import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { directorChildHref } from '@/constants/routes';
import { createChild, fetchNewChildChoices } from '@/data/director-children';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { NEW_CHILD_FORM_ACTIONS, INITIAL_NEW_CHILD_FORM_STATE, newChildFormReducer } from '@/features/director-children/new-child-form-reducer';
import {
  createChildArgs,
  hasErrors,
  newChildSaveError,
  roomChoices,
  shiftChoices,
  validateNewChild,
  withDefaultShift,
  type NewChildField,
  type NewChildFieldErrors,
} from '@/lib/new-child-form';

const NO_ERRORS: NewChildFieldErrors = {};

export function useNewChildForm() {
  const { session } = useSession();
  const nurseryId = session?.nursery_id ?? null;
  const choices = useAsync(() => fetchNewChildChoices(nurseryId!), nurseryId);
  const [state, dispatch] = useReducer(newChildFormReducer, INITIAL_NEW_CHILD_FORM_STATE);

  const rooms = roomChoices(choices.data?.rooms ?? []);
  const shifts = shiftChoices(choices.data?.shifts ?? []);
  const values = withDefaultShift(state.values, shifts);
  const errors = validateNewChild(values, new Date());
  const shownErrors = state.showErrors ? errors : NO_ERRORS;
  const saveError = state.saveError;

  function fieldError(field: NewChildField): string | null {
    if (saveError?.field === field) return saveError.message;
    return shownErrors[field] ?? null;
  }

  async function save() {
    if (!nurseryId) return;
    if (hasErrors(errors)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: NEW_CHILD_FORM_ACTIONS.SUBMIT_REFUSED });
      return;
    }
    dispatch({ type: NEW_CHILD_FORM_ACTIONS.SAVE_STARTED });
    let childId: string;
    try {
      childId = await createChild(createChildArgs(nurseryId, values));
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: NEW_CHILD_FORM_ACTIONS.SAVE_FAILED, error: newChildSaveError(error instanceof Error ? error.message : '') });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(directorChildHref(childId));
  }

  return {
    values,
    saving: state.status === 'saving',
    formError: saveError && !saveError.field ? saveError.message : null,
    fieldError,
    rooms,
    shifts,
    choicesLoading: choices.loading,
    choicesFailed: choices.failed,
    reloadChoices: choices.reload,
    change: (field: NewChildField, value: string) => dispatch({ type: NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED, field, value }),
    save,
  };
}
