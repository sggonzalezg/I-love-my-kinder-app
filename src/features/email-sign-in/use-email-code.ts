import * as Haptics from 'expo-haptics';
import { useEffect, useReducer } from 'react';

import { sendEmailCode, verifyEmailCode } from '@/data/email-sign-in';
import { CODE_STATUSES, EMAIL_CODE_ACTIONS, emailCodeReducer, initialEmailCodeState } from '@/features/email-sign-in/email-code-reducer';
import { useCompleteSignIn } from '@/features/email-sign-in/use-complete-sign-in';
import { SIGN_IN_FAILURES, sendCodeFailure, verifyCodeFailure, type AuthFailure } from '@/lib/email-sign-in';

const RESEND_TICK_MS = 1000;

export function useEmailCode(email: string, startsWaiting: boolean) {
  const completeSignIn = useCompleteSignIn();
  const [state, dispatch] = useReducer(emailCodeReducer, startsWaiting, (isWaiting) => initialEmailCodeState(Date.now(), isWaiting));
  const isCounting = state.resendSeconds > 0;

  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => dispatch({ type: EMAIL_CODE_ACTIONS.TICKED }), RESEND_TICK_MS);
    return () => clearInterval(timer);
  }, [isCounting]);

  useEffect(() => {
    if (state.status !== CODE_STATUSES.VERIFYING) return;
    let isMounted = true;

    async function signIn() {
      try {
        const userId = await verifyEmailCode(email, state.code);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (isMounted) dispatch({ type: EMAIL_CODE_ACTIONS.VERIFIED });
        await completeSignIn(userId, email);
      } catch (error) {
        const failure = verifyCodeFailure(error as AuthFailure, state.sentAt, Date.now());
        if (failure === SIGN_IN_FAILURES.OTHER) console.warn('Email code sign-in failed:', error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (isMounted) dispatch({ type: EMAIL_CODE_ACTIONS.VERIFY_FAILED, failure });
      }
    }

    signIn();
    return () => {
      isMounted = false;
    };
    // The code and send time are read once, when the verification starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  const canResend = !state.resending && !isCounting;

  async function resend() {
    if (!canResend) return;
    dispatch({ type: EMAIL_CODE_ACTIONS.RESEND_STARTED });
    try {
      await sendEmailCode(email);
      dispatch({ type: EMAIL_CODE_ACTIONS.CODE_SENT, sentAt: Date.now() });
    } catch (error) {
      dispatch({ type: EMAIL_CODE_ACTIONS.RESEND_FAILED, failure: sendCodeFailure(error as AuthFailure) });
    }
  }

  const changeCode = (code: string) => dispatch({ type: EMAIL_CODE_ACTIONS.CODE_CHANGED, code });

  return { state, canResend, changeCode, resend };
}
