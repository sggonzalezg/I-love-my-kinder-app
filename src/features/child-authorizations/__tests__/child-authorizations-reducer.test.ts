import {
  CHILD_AUTHORIZATIONS_ACTIONS,
  childAuthorizationsReducer,
  initialChildAuthorizationsState,
} from '@/features/child-authorizations/child-authorizations-reducer';

describe('childAuthorizationsReducer', () => {
  it('starts with no toast and the focus not yet scrolled to', () => {
    expect(initialChildAuthorizationsState).toEqual({ savedToastVisible: false, focusScrolled: false });
  });

  it('shows the "Guardado" toast after an answer is saved', () => {
    const state = childAuthorizationsReducer(initialChildAuthorizationsState, { type: CHILD_AUTHORIZATIONS_ACTIONS.ANSWER_SAVED });
    expect(state.savedToastVisible).toBe(true);
  });

  it('hides the toast when its time is up', () => {
    const shown = childAuthorizationsReducer(initialChildAuthorizationsState, { type: CHILD_AUTHORIZATIONS_ACTIONS.ANSWER_SAVED });
    expect(childAuthorizationsReducer(shown, { type: CHILD_AUTHORIZATIONS_ACTIONS.TOAST_HIDDEN }).savedToastVisible).toBe(false);
  });

  it('remembers that the screen already scrolled to the focused document', () => {
    const state = childAuthorizationsReducer(initialChildAuthorizationsState, { type: CHILD_AUTHORIZATIONS_ACTIONS.FOCUS_SCROLLED });
    expect(state.focusScrolled).toBe(true);
  });
});
