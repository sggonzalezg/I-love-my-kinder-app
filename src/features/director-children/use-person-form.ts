import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useReducer } from 'react';

import { fetchChildPerson, saveChildPerson } from '@/data/child-people';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { INITIAL_PERSON_FORM_STATE, PERSON_FORM_ACTIONS, personFormReducer } from '@/features/director-children/person-form-reducer';
import { personFormErrors, personFormValues, personRow, type PersonFormErrors, type PersonFormField, type PersonKind } from '@/lib/child-people';
import { hasErrors } from '@/lib/new-child-form';

const NO_ERRORS: PersonFormErrors = {};
const NEW_PERSON_KEY = 'new';

export function usePersonForm(childId: string, kind: PersonKind, personId: string | null) {
  const { session } = useSession();
  const stored = useAsync(() => (personId ? fetchChildPerson(kind, personId) : Promise.resolve(null)), `${kind}:${personId ?? NEW_PERSON_KEY}`);
  const [state, dispatch] = useReducer(personFormReducer, INITIAL_PERSON_FORM_STATE);
  const notFound = personId !== null && !stored.loading && !stored.failed && stored.data === null;
  const values = { ...personFormValues(stored.data), ...state.edits };
  const errors = personFormErrors(kind, values);
  const shownErrors = state.showErrors ? errors : NO_ERRORS;

  async function save() {
    if (!session) return;
    if (hasErrors(errors)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: PERSON_FORM_ACTIONS.SUBMIT_REFUSED });
      return;
    }
    dispatch({ type: PERSON_FORM_ACTIONS.SAVE_STARTED });
    try {
      await saveChildPerson({ kind, nurseryId: session.nursery_id, childId, personId }, personRow(kind, values));
    } catch (error) {
      console.warn('Child person save failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: PERSON_FORM_ACTIONS.SAVE_FAILED });
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return {
    values,
    loading: stored.loading,
    failed: stored.failed,
    notFound,
    reload: stored.reload,
    saving: state.status === 'saving',
    saveFailed: state.saveFailed,
    fieldError: (field: PersonFormField) => shownErrors[field] ?? null,
    change: (field: PersonFormField, value: string) => dispatch({ type: PERSON_FORM_ACTIONS.FIELD_CHANGED, field, value }),
    save,
  };
}
