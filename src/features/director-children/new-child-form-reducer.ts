import { EMPTY_NEW_CHILD_VALUES, type NewChildField, type NewChildFormValues, type NewChildSaveError } from '@/lib/new-child-form';

export type NewChildFormStatus = 'editing' | 'saving';

export interface NewChildFormState {
  values: NewChildFormValues;
  status: NewChildFormStatus;
  /** Field errors show only after the first "Crear", so the form does not open full of red. */
  showErrors: boolean;
  saveError: NewChildSaveError | null;
}

export const NEW_CHILD_FORM_ACTIONS = {
  FIELD_CHANGED: 'fieldChanged',
  SUBMIT_REFUSED: 'submitRefused',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type NewChildFormAction =
  | { type: typeof NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED; field: NewChildField; value: string }
  | { type: typeof NEW_CHILD_FORM_ACTIONS.SUBMIT_REFUSED }
  | { type: typeof NEW_CHILD_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof NEW_CHILD_FORM_ACTIONS.SAVE_FAILED; error: NewChildSaveError };

export const INITIAL_NEW_CHILD_FORM_STATE: NewChildFormState = {
  values: EMPTY_NEW_CHILD_VALUES,
  status: 'editing',
  showErrors: false,
  saveError: null,
};

export function newChildFormReducer(state: NewChildFormState, action: NewChildFormAction): NewChildFormState {
  switch (action.type) {
    case NEW_CHILD_FORM_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { ...state, values: { ...state.values, [action.field]: action.value }, saveError: null };
    case NEW_CHILD_FORM_ACTIONS.SUBMIT_REFUSED:
      return { ...state, showErrors: true };
    case NEW_CHILD_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving', showErrors: true, saveError: null };
    case NEW_CHILD_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'editing', saveError: action.error };
  }
}
