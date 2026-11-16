import { CODE_STATUSES, EMAIL_CODE_ACTIONS, emailCodeReducer, initialEmailCodeState } from '@/features/email-sign-in/email-code-reducer';
import { EMAIL_CODE_RESEND_SECONDS, SIGN_IN_FAILURES } from '@/lib/email-sign-in';

const SENT_AT = 1_000;
const filling = initialEmailCodeState(SENT_AT, false);

describe('emailCodeReducer', () => {
  it('starts filling with the resend countdown running', () => {
    expect(filling).toMatchObject({ status: CODE_STATUSES.FILLING, resendSeconds: EMAIL_CODE_RESEND_SECONDS, sentAt: SENT_AT });
  });

  it('starts on "Esperá un momento" when the send was rate limited', () => {
    expect(initialEmailCodeState(SENT_AT, true)).toMatchObject({ status: CODE_STATUSES.WAITING, resendSeconds: 0 });
  });

  it('keeps only digits, up to six', () => {
    const state = emailCodeReducer(filling, { type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code: '48 2-1' });
    expect(state).toMatchObject({ code: '4821', status: CODE_STATUSES.FILLING });
  });

  it('verifies by itself on the sixth digit', () => {
    const state = emailCodeReducer(filling, { type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code: '4821759' });
    expect(state).toMatchObject({ code: '482175', status: CODE_STATUSES.VERIFYING });
  });

  it('ignores typing while the code is being verified', () => {
    const verifying = { ...filling, code: '482175', status: CODE_STATUSES.VERIFYING };
    expect(emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code: '1' })).toBe(verifying);
  });

  it('turns the boxes green when the code is right', () => {
    const verifying = { ...filling, code: '482175', status: CODE_STATUSES.VERIFYING };
    expect(emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.VERIFIED }).status).toBe(CODE_STATUSES.CORRECT);
  });

  it('keeps a wrong code in the red boxes and empties the field', () => {
    const verifying = { ...filling, code: '482190', status: CODE_STATUSES.VERIFYING };
    const state = emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.VERIFY_FAILED, failure: SIGN_IN_FAILURES.WRONG_CODE });
    expect(state).toMatchObject({ status: CODE_STATUSES.WRONG, code: '', rejectedCode: '482190' });
  });

  it('clears the red boxes when the person types again', () => {
    const wrong = { ...filling, status: CODE_STATUSES.WRONG, rejectedCode: '482190' };
    const state = emailCodeReducer(wrong, { type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code: '7' });
    expect(state).toMatchObject({ status: CODE_STATUSES.FILLING, code: '7', rejectedCode: '' });
  });

  it('shows the expired state for an old code, with its digits dimmed', () => {
    const verifying = { ...filling, code: '482175', status: CODE_STATUSES.VERIFYING };
    const state = emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.VERIFY_FAILED, failure: SIGN_IN_FAILURES.EXPIRED });
    expect(state).toMatchObject({ status: CODE_STATUSES.EXPIRED, rejectedCode: '482175' });
  });

  it('ignores typing on an expired code: only a new code helps', () => {
    const expired = { ...filling, status: CODE_STATUSES.EXPIRED, rejectedCode: '482175' };
    expect(emailCodeReducer(expired, { type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code: '1' })).toBe(expired);
  });

  it('shows "Esperá un momento" when Supabase limits the tries', () => {
    const verifying = { ...filling, code: '482175', status: CODE_STATUSES.VERIFYING };
    const state = emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.VERIFY_FAILED, failure: SIGN_IN_FAILURES.RATE_LIMITED });
    expect(state.status).toBe(CODE_STATUSES.WAITING);
  });

  it('goes back to filling with the failure shown when the connection fails', () => {
    const verifying = { ...filling, code: '482175', status: CODE_STATUSES.VERIFYING };
    const state = emailCodeReducer(verifying, { type: EMAIL_CODE_ACTIONS.VERIFY_FAILED, failure: SIGN_IN_FAILURES.NETWORK });
    expect(state).toMatchObject({ status: CODE_STATUSES.FILLING, code: '', failure: SIGN_IN_FAILURES.NETWORK });
  });

  it('counts the resend wait down to zero and no further', () => {
    const almost = { ...filling, resendSeconds: 1 };
    const once = emailCodeReducer(almost, { type: EMAIL_CODE_ACTIONS.TICKED });
    expect(emailCodeReducer(once, { type: EMAIL_CODE_ACTIONS.TICKED }).resendSeconds).toBe(0);
  });

  it('does not resend before the countdown ends', () => {
    expect(emailCodeReducer(filling, { type: EMAIL_CODE_ACTIONS.RESEND_STARTED })).toBe(filling);
  });

  it('resends once the countdown ended', () => {
    const ready = { ...filling, resendSeconds: 0 };
    expect(emailCodeReducer(ready, { type: EMAIL_CODE_ACTIONS.RESEND_STARTED }).resending).toBe(true);
  });

  it('starts over with a new code: empty boxes, new send time and the countdown', () => {
    const expired = { ...filling, status: CODE_STATUSES.EXPIRED, resendSeconds: 0, resending: true };
    const state = emailCodeReducer(expired, { type: EMAIL_CODE_ACTIONS.CODE_SENT, sentAt: 9_000 });
    expect(state).toEqual(initialEmailCodeState(9_000, false));
  });

  it('shows "Esperá un momento" when the resend is rate limited', () => {
    const resending = { ...filling, resendSeconds: 0, resending: true };
    const state = emailCodeReducer(resending, { type: EMAIL_CODE_ACTIONS.RESEND_FAILED, failure: SIGN_IN_FAILURES.RATE_LIMITED });
    expect(state).toMatchObject({ resending: false, status: CODE_STATUSES.WAITING });
  });

  it('keeps the screen and shows the failure when the resend fails otherwise', () => {
    const resending = { ...filling, resendSeconds: 0, resending: true };
    const state = emailCodeReducer(resending, { type: EMAIL_CODE_ACTIONS.RESEND_FAILED, failure: SIGN_IN_FAILURES.NETWORK });
    expect(state).toMatchObject({ resending: false, status: CODE_STATUSES.FILLING, failure: SIGN_IN_FAILURES.NETWORK });
  });
});
