import type { PersonFormField, PersonFormValues } from '@/lib/child-people';

export type PersonFormStatus = 'editing' | 'saving';

export interface PersonFormState {
  /** What the director typed, on top of the stored person (or the empty form). */
  edits: Partial<PersonFormValues>;
  status: PersonFormStatus;
  showErrors: boolean;
  saveFailed: boolean;
}

export const PERSON_FORM_ACTIONS = {
  FIELD_CHANGED: 'fieldChanged',
  SUBMIT_REFUSED: 'submitRefused',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type PersonFormAction =
  | { type: typeof PERSON_FORM_ACTIONS.FIELD_CHANGED; field: PersonFormField; value: string }
  | { type: typeof PERSON_FORM_ACTIONS.SUBMIT_REFUSED }
  | { type: typeof PERSON_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof PERSON_FORM_ACTIONS.SAVE_FAILED };

export const INITIAL_PERSON_FORM_STATE: PersonFormState = { edits: {}, status: 'editing', showErrors: false, saveFailed: false };

export function personFormReducer(state: PersonFormState, action: PersonFormAction): PersonFormState {
  switch (action.type) {
    case PERSON_FORM_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { ...state, edits: { ...state.edits, [action.field]: action.value }, saveFailed: false };
    case PERSON_FORM_ACTIONS.SUBMIT_REFUSED:
      return { ...state, showErrors: true };
    case PERSON_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving', showErrors: true, saveFailed: false };
    case PERSON_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'editing', saveFailed: true };
  }
}
