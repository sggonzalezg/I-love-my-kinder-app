import { RESEND_WAIT_SECONDS } from '@/lib/account-deletion';

import {
  DELETE_ACCOUNT_ACTIONS,
  DELETION_PHASES,
  deleteAccountReducer,
  initialDeleteAccountState,
  type DeleteAccountState,
} from '../delete-account-reducer';

const ready = (code = ''): DeleteAccountState => {
  const sent = deleteAccountReducer(initialDeleteAccountState, { type: DELETE_ACCOUNT_ACTIONS.CODE_SENT });
  return deleteAccountReducer(sent, { type: DELETE_ACCOUNT_ACTIONS.CODE_CHANGED, code });
};

describe('deleteAccountReducer (S1 delete step 2)', () => {
  it('starts sending the code, with an empty code and no error', () => {
    expect(initialDeleteAccountState).toEqual({ phase: DELETION_PHASES.SENDING, code: '', error: null, resendSeconds: 0, deletedAt: null });
  });

  it('starts the resend countdown once the code is sent', () => {
    expect(ready()).toMatchObject({ phase: DELETION_PHASES.READY, resendSeconds: RESEND_WAIT_SECONDS });
  });

  it('shows the error when the code could not be sent and lets the person resend', () => {
    const state = deleteAccountReducer(initialDeleteAccountState, { type: DELETE_ACCOUNT_ACTIONS.SEND_FAILED, message: 'Falló' });
    expect(state).toMatchObject({ phase: DELETION_PHASES.READY, error: 'Falló', resendSeconds: 0 });
  });

  it('clears the error when a new code is requested', () => {
    const failed = deleteAccountReducer(initialDeleteAccountState, { type: DELETE_ACCOUNT_ACTIONS.SEND_FAILED, message: 'Falló' });
    expect(deleteAccountReducer(failed, { type: DELETE_ACCOUNT_ACTIONS.CODE_REQUESTED })).toMatchObject({ phase: DELETION_PHASES.SENDING, error: null });
  });

  it('keeps only the first six digits of a typed or pasted code', () => {
    expect(ready('51 82-0799').code).toBe('518207');
  });

  it('counts the resend wait down and stops at zero', () => {
    let state = deleteAccountReducer(ready(), { type: DELETE_ACCOUNT_ACTIONS.TICKED });
    expect(state.resendSeconds).toBe(RESEND_WAIT_SECONDS - 1);
    state = { ...state, resendSeconds: 0 };
    expect(deleteAccountReducer(state, { type: DELETE_ACCOUNT_ACTIONS.TICKED }).resendSeconds).toBe(0);
  });

  it('does not start deleting with an incomplete code', () => {
    const state = ready('5182');
    expect(deleteAccountReducer(state, { type: DELETE_ACCOUNT_ACTIONS.DELETE_STARTED })).toBe(state);
  });

  it('starts deleting with a complete code', () => {
    expect(deleteAccountReducer(ready('518207'), { type: DELETE_ACCOUNT_ACTIONS.DELETE_STARTED }).phase).toBe(DELETION_PHASES.DELETING);
  });

  it('shows the real error and empties the code when the deletion fails', () => {
    const deleting = deleteAccountReducer(ready('518207'), { type: DELETE_ACCOUNT_ACTIONS.DELETE_STARTED });
    const failed = deleteAccountReducer(deleting, { type: DELETE_ACCOUNT_ACTIONS.DELETE_FAILED, message: 'El código no es correcto o venció. Pedí uno nuevo.' });
    expect(failed).toMatchObject({ phase: DELETION_PHASES.READY, code: '', error: 'El código no es correcto o venció. Pedí uno nuevo.' });
  });

  it('keeps the deletion time once the account is deleted', () => {
    const deleting = deleteAccountReducer(ready('518207'), { type: DELETE_ACCOUNT_ACTIONS.DELETE_STARTED });
    const deleted = deleteAccountReducer(deleting, { type: DELETE_ACCOUNT_ACTIONS.DELETED, deletedAt: '2026-11-13T10:00:00.000Z' });
    expect(deleted).toMatchObject({ phase: DELETION_PHASES.DELETED, deletedAt: '2026-11-13T10:00:00.000Z' });
  });
});
