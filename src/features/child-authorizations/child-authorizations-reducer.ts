export interface ChildAuthorizationsState {
  savedToastVisible: boolean;
  focusScrolled: boolean;
}

export const CHILD_AUTHORIZATIONS_ACTIONS = {
  ANSWER_SAVED: 'answerSaved',
  TOAST_HIDDEN: 'toastHidden',
  FOCUS_SCROLLED: 'focusScrolled',
} as const;

export type ChildAuthorizationsAction = { type: (typeof CHILD_AUTHORIZATIONS_ACTIONS)[keyof typeof CHILD_AUTHORIZATIONS_ACTIONS] };

export const initialChildAuthorizationsState: ChildAuthorizationsState = { savedToastVisible: false, focusScrolled: false };

export function childAuthorizationsReducer(state: ChildAuthorizationsState, action: ChildAuthorizationsAction): ChildAuthorizationsState {
  switch (action.type) {
    case CHILD_AUTHORIZATIONS_ACTIONS.ANSWER_SAVED:
      return { ...state, savedToastVisible: true };
    case CHILD_AUTHORIZATIONS_ACTIONS.TOAST_HIDDEN:
      return { ...state, savedToastVisible: false };
    case CHILD_AUTHORIZATIONS_ACTIONS.FOCUS_SCROLLED:
      return { ...state, focusScrolled: true };
  }
}
