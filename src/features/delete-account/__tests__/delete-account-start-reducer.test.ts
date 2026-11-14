import { DELETE_ACCOUNT_START_ACTIONS, deleteAccountStartReducer, initialDeleteAccountStartState } from '../delete-account-start-reducer';

describe('deleteAccountStartReducer (S1 delete step 1 sheet)', () => {
  it('starts closed', () => {
    expect(initialDeleteAccountStartState).toEqual({ open: false, checking: false, onlyDirector: false, soleTeacherGroup: null, error: null });
  });

  it('opens with no check for a family', () => {
    const state = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: false });
    expect(state).toEqual({ open: true, checking: false, onlyDirector: false, soleTeacherGroup: null, error: null });
  });

  it('opens checking whether the director or teacher is the only one', () => {
    const state = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: true });
    expect(state).toMatchObject({ open: true, checking: true });
  });

  it('shows the blocked sheet for the only director', () => {
    const checking = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: true });
    const state = deleteAccountStartReducer(checking, { type: DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED, onlyDirector: true, soleTeacherGroup: null });
    expect(state).toMatchObject({ checking: false, onlyDirector: true });
  });

  it('shows the talk-to-the-director sheet for the only teacher of a group', () => {
    const checking = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: true });
    const state = deleteAccountStartReducer(checking, {
      type: DELETE_ACCOUNT_START_ACTIONS.CHECK_SUCCEEDED,
      onlyDirector: false,
      soleTeacherGroup: 'Sala 2 · Vespertino',
    });
    expect(state).toMatchObject({ checking: false, soleTeacherGroup: 'Sala 2 · Vespertino' });
  });

  it('shows the error when the check fails, and a retry checks again', () => {
    const checking = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: true });
    const failed = deleteAccountStartReducer(checking, { type: DELETE_ACCOUNT_START_ACTIONS.CHECK_FAILED, message: 'No pudimos eliminar tu cuenta. Probá de nuevo.' });
    expect(failed).toMatchObject({ checking: false, error: 'No pudimos eliminar tu cuenta. Probá de nuevo.' });
    expect(deleteAccountStartReducer(failed, { type: DELETE_ACCOUNT_START_ACTIONS.CHECK_RETRIED })).toMatchObject({ checking: true, error: null });
  });

  it('closes back to the start', () => {
    const open = deleteAccountStartReducer(initialDeleteAccountStartState, { type: DELETE_ACCOUNT_START_ACTIONS.OPENED, needsCheck: true });
    expect(deleteAccountStartReducer(open, { type: DELETE_ACCOUNT_START_ACTIONS.CLOSED })).toEqual(initialDeleteAccountStartState);
  });
});
