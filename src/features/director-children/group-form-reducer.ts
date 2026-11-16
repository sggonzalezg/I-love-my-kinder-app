import type { GroupFormField, GroupFormValues } from '@/lib/child-enrollments';

export type GroupFormStatus = 'editing' | 'saving';

export interface GroupFormState {
  edits: Partial<GroupFormValues>;
  status: GroupFormStatus;
  showErrors: boolean;
  saveError: string | null;
}

export const GROUP_FORM_ACTIONS = {
  FIELD_CHANGED: 'fieldChanged',
  SUBMIT_REFUSED: 'submitRefused',
  SAVE_STARTED: 'saveStarted',
  SAVE_FAILED: 'saveFailed',
} as const;

export type GroupFormAction =
  | { type: typeof GROUP_FORM_ACTIONS.FIELD_CHANGED; field: GroupFormField; value: string }
  | { type: typeof GROUP_FORM_ACTIONS.SUBMIT_REFUSED }
  | { type: typeof GROUP_FORM_ACTIONS.SAVE_STARTED }
  | { type: typeof GROUP_FORM_ACTIONS.SAVE_FAILED; message: string };

export const INITIAL_GROUP_FORM_STATE: GroupFormState = { edits: {}, status: 'editing', showErrors: false, saveError: null };

export function groupFormReducer(state: GroupFormState, action: GroupFormAction): GroupFormState {
  switch (action.type) {
    case GROUP_FORM_ACTIONS.FIELD_CHANGED:
      if (state.status === 'saving') return state;
      return { ...state, edits: { ...state.edits, [action.field]: action.value }, saveError: null };
    case GROUP_FORM_ACTIONS.SUBMIT_REFUSED:
      return { ...state, showErrors: true };
    case GROUP_FORM_ACTIONS.SAVE_STARTED:
      return { ...state, status: 'saving', showErrors: true, saveError: null };
    case GROUP_FORM_ACTIONS.SAVE_FAILED:
      return { ...state, status: 'editing', saveError: action.message };
  }
}
