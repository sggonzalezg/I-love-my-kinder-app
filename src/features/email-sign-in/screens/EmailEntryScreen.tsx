import { useRouter } from 'expo-router';
import { useReducer } from 'react';
import { Linking, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { FormTextField } from '@/components/FormTextField/FormTextField';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { NURSERY_WHATSAPP_URL } from '@/constants/nursery';
import { accountNotEnabledHref, emailCodeHref } from '@/constants/routes';
import { sendEmailCode } from '@/data/email-sign-in';
import { AuthHeader } from '@/features/email-sign-in/components/AuthHeader/AuthHeader';
import { OrDivider } from '@/features/email-sign-in/components/OrDivider/OrDivider';
import { ProviderButtons } from '@/features/email-sign-in/components/ProviderButtons/ProviderButtons';
import { EMAIL_ENTRY_ACTIONS, PROVIDER_NOTICES, emailEntryReducer, initialEmailEntryState, isEntryBusy } from '@/features/email-sign-in/email-entry-reducer';
import { EMAIL_PROBLEM_COPY, EMAIL_SIGN_IN_COPY, SOCIAL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';
import { useProviderSignIn } from '@/features/email-sign-in/use-provider-sign-in';
import { SIGN_IN_FAILURES, emailProblem, normalizeEmail, sendCodeFailure, type AuthFailure } from '@/lib/email-sign-in';
import type { SocialProvider } from '@/lib/social-sign-in';

import { styles } from './EmailEntryScreen.styles';

const EMAIL_MAX_LENGTH = 254;

export function EmailEntryScreen() {
  const router = useRouter();
  const [state, dispatch] = useReducer(emailEntryReducer, initialEmailEntryState);
  const signInWithProvider = useProviderSignIn(dispatch);
  const isBusy = isEntryBusy(state);
  const notice = state.providerNotice;
  const hasBanner = Boolean(notice || state.failure);

  async function sendCode() {
    if (isBusy) return;
    const problem = emailProblem(state.email);
    if (problem) {
      dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_REFUSED, problem });
      return;
    }
    const email = normalizeEmail(state.email);
    dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_STARTED });
    try {
      await sendEmailCode(email);
      dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_FINISHED });
      router.push(emailCodeHref(email));
    } catch (error) {
      const failure = sendCodeFailure(error as AuthFailure);
      if (failure === SIGN_IN_FAILURES.NOT_ENABLED) {
        dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_FINISHED });
        router.push(accountNotEnabledHref(email));
      } else if (failure === SIGN_IN_FAILURES.RATE_LIMITED) {
        dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_FINISHED });
        router.push(emailCodeHref(email, true));
      } else {
        console.warn('Email code send failed:', failure);
        dispatch({ type: EMAIL_ENTRY_ACTIONS.SEND_FAILED, failure });
      }
    }
  }

  function startProviderSignIn(provider: SocialProvider) {
    if (!isBusy) signInWithProvider(provider);
  }

  return (
    <Screen>
      <AuthHeader lede={hasBanner ? undefined : EMAIL_SIGN_IN_COPY.entryLede} />
      <View style={styles.body}>
        {state.failure === SIGN_IN_FAILURES.NETWORK ? <Banner kind="offline" text={EMAIL_SIGN_IN_COPY.offline} /> : null}
        {state.failure && state.failure !== SIGN_IN_FAILURES.NETWORK ? <Banner kind="error" text={EMAIL_SIGN_IN_COPY.sendFailed} /> : null}
        {notice?.kind === PROVIDER_NOTICES.CANCELLED ? <Banner kind="info" text={SOCIAL_SIGN_IN_COPY.cancelled(notice.provider)} /> : null}
        {notice?.kind === PROVIDER_NOTICES.FAILED ? <Banner kind="error" text={SOCIAL_SIGN_IN_COPY.failed(notice.provider)} /> : null}
        {state.providers.length ? (
          <>
            <ProviderButtons providers={state.providers} busyProvider={state.busyProvider} disabled={isBusy} onPress={startProviderSignIn} />
            <OrDivider />
          </>
        ) : null}
        <FormTextField
          label={EMAIL_SIGN_IN_COPY.emailLabel}
          value={state.email}
          error={state.problem ? EMAIL_PROBLEM_COPY[state.problem] : null}
          keyboardType="email-address"
          editable={!isBusy}
          maxLength={EMAIL_MAX_LENGTH}
          onChange={(email) => dispatch({ type: EMAIL_ENTRY_ACTIONS.EMAIL_CHANGED, email })}
          textEntry={{
            placeholder: EMAIL_SIGN_IN_COPY.emailPlaceholder,
            autoComplete: 'email',
            textContentType: 'emailAddress',
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'send',
            onSubmitEditing: sendCode,
          }}
        />
        <Button label={EMAIL_SIGN_IN_COPY.sendCode} block loading={state.sending} disabled={state.busyProvider !== null} onPress={sendCode} />
      </View>
      <Text variant="caption" tone="muted" style={styles.foot}>
        {EMAIL_SIGN_IN_COPY.troubleQuestion}
        <Text variant="caption" tone="blue" style={styles.footLink} accessibilityRole="link" onPress={() => Linking.openURL(NURSERY_WHATSAPP_URL)}>
          {EMAIL_SIGN_IN_COPY.troubleLink}
        </Text>
      </Text>
    </Screen>
  );
}
