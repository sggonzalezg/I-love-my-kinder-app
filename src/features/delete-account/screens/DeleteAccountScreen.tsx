import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Clipboard as ClipboardIcon } from 'lucide-react-native';
import { useEffect, useReducer } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/button';
import OtpInput from '@/components/otp-input';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { TopBar } from '@/components/top-bar';
import { confirmDeletion, fetchAccountEmail, sendDeletionCode } from '@/data/account-deletion';
import { forgetStoredSession, signOut } from '@/data/session';
import type { FunctionError } from '@/data/supabase';
import { useAsync } from '@/data/use-async';
import { AccountDeletedView } from '@/features/delete-account/components/AccountDeletedView/AccountDeletedView';
import { DELETE_ACCOUNT_COPY } from '@/features/delete-account/delete-account-copy';
import {
  DELETE_ACCOUNT_ACTIONS,
  DELETION_PHASES,
  deleteAccountReducer,
  initialDeleteAccountState,
} from '@/features/delete-account/delete-account-reducer';
import { RESEND_TICK_MS, deletionErrorMessage, isCompleteDeletionCode } from '@/lib/account-deletion';
import { formatCountdown } from '@/lib/dates';

import { styles } from './DeleteAccountScreen.styles';

const ACCOUNT_EMAIL_KEY = 'account-email';

export function DeleteAccountScreen() {
  const [state, dispatch] = useReducer(deleteAccountReducer, initialDeleteAccountState);
  const accountEmail = useAsync(fetchAccountEmail, ACCOUNT_EMAIL_KEY);
  const isCounting = state.resendSeconds > 0;

  useEffect(() => {
    if (state.phase !== DELETION_PHASES.SENDING) return;
    let isMounted = true;
    sendDeletionCode()
      .then(() => isMounted && dispatch({ type: DELETE_ACCOUNT_ACTIONS.CODE_SENT }))
      .catch((error: FunctionError) => {
        if (isMounted) dispatch({ type: DELETE_ACCOUNT_ACTIONS.SEND_FAILED, message: deletionErrorMessage(error.code) });
      });
    return () => {
      isMounted = false;
    };
  }, [state.phase]);

  useEffect(() => {
    if (!isCounting) return;
    const timer = setInterval(() => dispatch({ type: DELETE_ACCOUNT_ACTIONS.TICKED }), RESEND_TICK_MS);
    return () => clearInterval(timer);
  }, [isCounting]);

  useEffect(() => {
    if (state.phase !== DELETION_PHASES.DELETING) return;
    let isMounted = true;
    confirmDeletion(state.code)
      .then(async (deletedAt) => {
        await forgetStoredSession();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (isMounted) dispatch({ type: DELETE_ACCOUNT_ACTIONS.DELETED, deletedAt });
      })
      .catch((error: FunctionError) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        if (isMounted) dispatch({ type: DELETE_ACCOUNT_ACTIONS.DELETE_FAILED, message: deletionErrorMessage(error.code) });
      });
    return () => {
      isMounted = false;
    };
    // The code is read once, when the deletion starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const changeCode = (code: string) => dispatch({ type: DELETE_ACCOUNT_ACTIONS.CODE_CHANGED, code });

  async function pasteCode() {
    changeCode(await Clipboard.getStringAsync());
  }

  if (state.phase === DELETION_PHASES.DELETED && state.deletedAt) {
    return <AccountDeletedView deletedAt={new Date(state.deletedAt)} onDone={signOut} />;
  }

  const isDeleting = state.phase === DELETION_PHASES.DELETING;

  return (
    <Screen header={<TopBar title={DELETE_ACCOUNT_COPY.codeTitle} backLabel={DELETE_ACCOUNT_COPY.back} />}>
      <View>
        <Text>
          {DELETE_ACCOUNT_COPY.codeSentTo}
          <Text variant="bodyStrong">{accountEmail.data ?? DELETE_ACCOUNT_COPY.accountEmailFallback}</Text>.
        </Text>
        <OtpInput value={state.code} onChangeText={changeCode} error={!!state.error} editable={!isDeleting} style={styles.otp} />
        <View style={styles.actionsRow}>
          <Button label={DELETE_ACCOUNT_COPY.pasteCode} icon={ClipboardIcon} variant="plain" disabled={isDeleting} onPress={pasteCode} />
          {isCounting ? (
            <Text variant="small" tone="muted" numeric>
              {DELETE_ACCOUNT_COPY.resendIn(formatCountdown(state.resendSeconds))}
            </Text>
          ) : (
            <Button
              label={DELETE_ACCOUNT_COPY.resend}
              variant="plain"
              disabled={state.phase !== DELETION_PHASES.READY}
              onPress={() => dispatch({ type: DELETE_ACCOUNT_ACTIONS.CODE_REQUESTED })}
            />
          )}
        </View>
        <Text variant="caption" tone="muted" style={styles.tip}>
          {DELETE_ACCOUNT_COPY.spamTip}
        </Text>
        {state.error && (
          <Text variant="small" tone="red" accessibilityRole="alert" style={styles.error}>
            {state.error}
          </Text>
        )}
        <Button
          label={isDeleting ? DELETE_ACCOUNT_COPY.deleting : DELETE_ACCOUNT_COPY.deleteForGood}
          variant="danger"
          block
          loading={isDeleting}
          disabled={!isCompleteDeletionCode(state.code) && !isDeleting}
          onPress={() => dispatch({ type: DELETE_ACCOUNT_ACTIONS.DELETE_STARTED })}
          style={styles.deleteAction}
        />
        <Button label={DELETE_ACCOUNT_COPY.cancel} variant="plain" block disabled={isDeleting} onPress={() => router.back()} style={styles.cancelAction} />
      </View>
    </Screen>
  );
}
