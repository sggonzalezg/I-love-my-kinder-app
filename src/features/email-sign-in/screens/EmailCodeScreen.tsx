import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Clipboard as ClipboardIcon, Clock, Mail } from 'lucide-react-native';
import { ActivityIndicator, Linking, Platform, View } from 'react-native';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { CODE_BOX_LOOKS, CodeBoxes, type CodeBoxLook } from '@/components/CodeBoxes/CodeBoxes';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { AlertLine } from '@/components/AlertLine/AlertLine';
import { SpamTip } from '@/features/email-sign-in/components/SpamTip/SpamTip';
import { CODE_STATUSES, type CodeStatus } from '@/features/email-sign-in/email-code-reducer';
import { EMAIL_SIGN_IN_COPY } from '@/features/email-sign-in/email-sign-in-copy';
import { useEmailCode } from '@/features/email-sign-in/use-email-code';
import { formatCountdown } from '@/lib/dates';
import { EMAIL_CODE_LENGTH, SIGN_IN_FAILURES } from '@/lib/email-sign-in';
import { useColors } from '@/theme/use-theme';

import { styles } from './EmailCodeScreen.styles';

// shortcut: Android has no link that opens the mail inbox; add it with expo-intent-launcher if Seba wants it there too.
const MAIL_APP_URL = 'message:';
const CAN_OPEN_MAIL_APP = Platform.OS === 'ios';

const LOOK_BY_STATUS: Record<CodeStatus, CodeBoxLook> = {
  [CODE_STATUSES.FILLING]: CODE_BOX_LOOKS.FILLING,
  [CODE_STATUSES.VERIFYING]: CODE_BOX_LOOKS.FILLING,
  [CODE_STATUSES.CORRECT]: CODE_BOX_LOOKS.CORRECT,
  [CODE_STATUSES.WRONG]: CODE_BOX_LOOKS.WRONG,
  [CODE_STATUSES.EXPIRED]: CODE_BOX_LOOKS.DIM,
  [CODE_STATUSES.WAITING]: CODE_BOX_LOOKS.FILLING,
};

interface EmailCodeScreenProps {
  email: string;
  startsWaiting: boolean;
}

export function EmailCodeScreen({ email, startsWaiting }: EmailCodeScreenProps) {
  const router = useRouter();
  const colors = useColors();
  const { state, canResend, changeCode, resend } = useEmailCode(email, startsWaiting);
  const header = <TopBar backLabel={EMAIL_SIGN_IN_COPY.back} />;

  if (state.status === CODE_STATUSES.WAITING) {
    return (
      <Screen header={header}>
        <Text variant="display" accessibilityRole="header" style={styles.title}>
          {EMAIL_SIGN_IN_COPY.waitTitle}
        </Text>
        <Text accessibilityRole="alert">
          {EMAIL_SIGN_IN_COPY.waitBefore}
          <Text variant="bodyStrong">{email}</Text>
          {EMAIL_SIGN_IN_COPY.waitAfter}
        </Text>
        <Button label={EMAIL_SIGN_IN_COPY.back} variant="soft" block onPress={() => router.back()} style={styles.wideAction} />
      </Screen>
    );
  }

  const isFilling = state.status === CODE_STATUSES.FILLING;
  const isSigningIn = state.status === CODE_STATUSES.VERIFYING || state.status === CODE_STATUSES.CORRECT;
  const isExpired = state.status === CODE_STATUSES.EXPIRED;
  const isEditable = isFilling || state.status === CODE_STATUSES.WRONG;
  const shownDigits = state.rejectedCode || state.code;

  async function pasteCode() {
    changeCode(await Clipboard.getStringAsync());
  }

  return (
    <Screen header={header}>
      <Text variant="display" accessibilityRole="header" style={styles.title}>
        {EMAIL_SIGN_IN_COPY.codeTitle}
      </Text>
      <Text tone="muted">
        {EMAIL_SIGN_IN_COPY.codeSentTo}
        <Text variant="bodyStrong">{email}</Text>
        {isFilling ? (
          <>
            {' · '}
            <Text tone="blue" style={styles.link} accessibilityRole="link" onPress={() => router.back()}>
              {EMAIL_SIGN_IN_COPY.change}
            </Text>
          </>
        ) : null}
      </Text>

      <View style={styles.boxes}>
        <CodeBoxes
          digits={shownDigits}
          value={state.code}
          length={EMAIL_CODE_LENGTH}
          look={LOOK_BY_STATUS[state.status]}
          editable={isEditable}
          accessibilityLabel={EMAIL_SIGN_IN_COPY.codeLabel(state.code.length)}
          onChange={changeCode}
        />
      </View>

      {isSigningIn ? (
        <View style={styles.status} accessibilityRole="text" accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.blue} />
          <Text variant="bodyStrong" tone="muted">
            {EMAIL_SIGN_IN_COPY.signingIn}
          </Text>
        </View>
      ) : null}

      {state.status === CODE_STATUSES.WRONG ? <AlertLine text={EMAIL_SIGN_IN_COPY.wrongCode} /> : null}
      {state.failure === SIGN_IN_FAILURES.NETWORK ? <Banner kind="offline" text={EMAIL_SIGN_IN_COPY.offline} /> : null}
      {state.failure && state.failure !== SIGN_IN_FAILURES.NETWORK ? <AlertLine text={EMAIL_SIGN_IN_COPY.verifyFailed} /> : null}

      {isExpired ? (
        <>
          <AlertLine text={EMAIL_SIGN_IN_COPY.expired} icon={Clock} />
          <Button label={EMAIL_SIGN_IN_COPY.sendAnother} block loading={state.resending} onPress={resend} style={styles.wideAction} />
        </>
      ) : null}

      {isEditable ? (
        <View style={styles.tools}>
          <Button label={EMAIL_SIGN_IN_COPY.paste} icon={ClipboardIcon} variant="plain" onPress={pasteCode} />
          {state.resendSeconds > 0 ? (
            <Text variant="small" tone="muted" numeric>
              {EMAIL_SIGN_IN_COPY.resendIn(formatCountdown(state.resendSeconds))}
            </Text>
          ) : (
            <Button label={EMAIL_SIGN_IN_COPY.resend} variant="plain" loading={state.resending} disabled={!canResend} onPress={resend} />
          )}
        </View>
      ) : null}

      {isFilling ? (
        <>
          {CAN_OPEN_MAIL_APP ? (
            <Button label={EMAIL_SIGN_IN_COPY.openMail} icon={Mail} variant="soft" block onPress={() => Linking.openURL(MAIL_APP_URL)} style={styles.openMail} />
          ) : null}
          <SpamTip />
        </>
      ) : null}
    </Screen>
  );
}
