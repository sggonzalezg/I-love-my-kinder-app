import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { fetchDirectorChildFile, updateChildColumns } from '@/data/director-child-file';
import { useAsync } from '@/data/use-async';
import { CHILD_FILE_ACTIONS, INITIAL_CHILD_FILE_STATE, childFileReducer } from '@/features/director-children/child-file-reducer';
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
  const [state, dispatch] = useReducer(childFileReducer, INITIAL_CHILD_FILE_STATE);
  const child = file.data;
  const values = child ? { ...initialChildFileValues(child), ...state.edits } : null;
  const errors = values ? childFileErrors(state.part, values, new Date()) : NO_ERRORS;
  const shownErrors = state.showErrors ? errors : NO_ERRORS;

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
  };
}
