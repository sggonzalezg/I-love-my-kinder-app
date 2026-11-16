import { EMAIL_ENTRY_ACTIONS, emailEntryReducer, initialEmailEntryState } from '@/features/email-sign-in/email-entry-reducer';
import { EMAIL_PROBLEMS, SIGN_IN_FAILURES } from '@/lib/email-sign-in';

describe('emailEntryReducer', () => {
  it('keeps what the person types', () => {
    const state = emailEntryReducer(initialEmailEntryState, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'ana@gmail.com' });
    expect(state.email).toBe('ana@gmail.com');
  });

  it('shows the email problem after the tap', () => {
    const state = emailEntryReducer(initialEmailEntryState, { type: EMAIL_ENTRY_ACTIONS.SEND_REFUSED, problem: EMAIL_PROBLEMS.MISSING_END });
    expect(state.problem).toBe(EMAIL_PROBLEMS.MISSING_END);
  });

  it('clears the problem when the person edits the email', () => {
    const refused = { ...initialEmailEntryState, problem: EMAIL_PROBLEMS.MISSING_END };
    const state = emailEntryReducer(refused, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'ana@gmail.c' });
    expect(state.problem).toBeNull();
  });

  it('clears an earlier failure when sending again', () => {
    const failed = { ...initialEmailEntryState, failure: SIGN_IN_FAILURES.NETWORK };
    const state = emailEntryReducer(failed, { type: EMAIL_ENTRY_ACTIONS.SEND_STARTED });
    expect(state).toMatchObject({ sending: true, failure: null });
  });

  it('does not change the email while the code is being sent', () => {
    const sending = { ...initialEmailEntryState, email: 'ana@gmail.com', sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email: 'otra@gmail.com' });
    expect(state.email).toBe('ana@gmail.com');
  });

  it('keeps the failure and turns the button back on when the send fails', () => {
    const sending = { ...initialEmailEntryState, sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.SEND_FAILED, failure: SIGN_IN_FAILURES.NETWORK });
    expect(state).toMatchObject({ sending: false, failure: SIGN_IN_FAILURES.NETWORK });
  });

  it('keeps the email when the send finishes, so going back shows it', () => {
    const sending = { ...initialEmailEntryState, email: 'ana@gmail.com', sending: true };
    const state = emailEntryReducer(sending, { type: EMAIL_ENTRY_ACTIONS.SEND_FINISHED });
    expect(state).toMatchObject({ sending: false, email: 'ana@gmail.com' });
  });
});
