import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useReducer } from 'react';
import { Linking, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Banner } from '@/components/banner';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { TopBar } from '@/components/top-bar';
import { PERMISSION_CHIP_VARIANT } from '@/constants/outing';
import { answerOuting, fetchOutingPermission, type OutingPermissionData } from '@/data/outing-permission';
import { useSession } from '@/data/session';
import { useAsync } from '@/data/use-async';
import { OUTING } from '@/legal/texts';
import { isNetworkFailure } from '@/lib/network';
import type { OutingAnswer } from '@/lib/outing';
import { childPermission, formatOutingDay, isInOutingAudience, permissionHistory } from '@/lib/outing-permission';
import { ChildPermissionBlock } from './child-permission-block';
import { OutingFacts } from './outing-facts';
import { PERMISSION_COPY } from './outing-permission-copy';
import { footerBottomPadding, useOutingPermissionScreenStyles } from './outing-permission-screen.styles';
import {
  INITIAL_PERMISSION_STATE,
  PERMISSION_ACTIONS,
  decisionOf,
  outingPermissionReducer,
  type AnswerIntent,
} from './outing-permission-reducer';
import { PermissionAnswers } from './permission-answers';
import { PermissionConfirmSheet } from './permission-confirm-sheet';

const SKELETON_HEIGHTS = [28, 140, 160];

export function OutingPermissionScreen({ eventId }: { eventId: string }) {
  const { session } = useSession();
  const userId = session?.user_id ?? null;
  const permission = useAsync(() => fetchOutingPermission(eventId, userId!), userId && eventId ? `${eventId}:${userId}` : null);
  const styles = useOutingPermissionScreenStyles();
  const header = <TopBar title={PERMISSION_COPY.screenTitle} backLabel={PERMISSION_COPY.back} onBack={() => router.back()} />;

  if (permission.failed) {
    return (
      <Screen header={header}>
        <View style={styles.error}>
          <Text color="red">{PERMISSION_COPY.loadError}</Text>
          <Button label={PERMISSION_COPY.retry} variant="soft" onPress={permission.reload} />
        </View>
      </Screen>
    );
  }
  if (!permission.data || !userId) {
    return (
      <Screen header={header}>
        {SKELETON_HEIGHTS.map((height, index) => (
          <Skeleton key={index} height={height} />
        ))}
      </Screen>
    );
  }
  return <OutingPermissionView data={permission.data} userId={userId} urgentPhone={session?.nursery_urgent_phone ?? ''} header={header} />;
}

interface OutingPermissionViewProps {
  data: OutingPermissionData;
  userId: string;
  urgentPhone: string;
  header: React.ReactNode;
}

function OutingPermissionView({ data, userId, urgentPhone, header }: OutingPermissionViewProps) {
  const styles = useOutingPermissionScreenStyles();
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useReducer(outingPermissionReducer, INITIAL_PERMISSION_STATE);
  const { outing, guardian } = data;
  const answers = [...data.answers, ...state.savedAnswers];
  const now = new Date();
  const invited = guardian.children.filter((child) => isInOutingAudience(child, outing));
  const permissions = invited.map((child) => ({ child, permission: childPermission(answers, child.id, outing, userId, now) }));
  const single = permissions.length === 1 ? permissions[0] : null;
  const askedAgain = permissions.some(({ permission }) => permission.askedAgain);
  const singleNeedsAnswer = single !== null && single.permission.answer === null && !single.permission.locked;
  const confirmChild = invited.find((child) => child.id === state.confirm?.childId) ?? null;

  useEffect(() => {
    if (!state.toastVisible) return;
    const timer = setTimeout(() => dispatch({ type: PERMISSION_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.toastVisible]);

  function openConfirm(childId: string, intent: AnswerIntent) {
    Haptics.selectionAsync();
    dispatch({ type: PERMISSION_ACTIONS.CONFIRM_OPENED, childId, intent });
  }

  async function confirmAnswer() {
    if (!state.confirm || !confirmChild) return;
    const { childId, intent } = state.confirm;
    const decision = decisionOf(intent);
    dispatch({ type: PERMISSION_ACTIONS.SAVE_STARTED, childId });
    try {
      await answerOuting({ eventId: outing.id, childId, decision });
      const saved: OutingAnswer = {
        child_id: childId,
        decision,
        created_at: new Date().toISOString(),
        permission_version: outing.permissionVersion,
        signer_name: guardian.fullName,
        signer_relationship: confirmChild.relationship,
        signed_by: userId,
      };
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: PERMISSION_ACTIONS.SAVE_SUCCEEDED, answer: saved });
    } catch (error) {
      console.warn('Outing answer failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: PERMISSION_ACTIONS.SAVE_FAILED, childId, reason: isNetworkFailure(error) ? 'offline' : 'error' });
    }
  }

  function callNursery() {
    if (urgentPhone) Linking.openURL(`tel:${urgentPhone}`);
  }

  return (
    <View style={styles.root}>
      <Screen header={header}>
        {single ? (
          <Chip label={PERMISSION_COPY.statusChip[single.permission.status]} variant={PERMISSION_CHIP_VARIANT[single.permission.status]} />
        ) : null}
        <Text variant="display" accessibilityRole="header">
          {outing.title}
        </Text>
        {askedAgain ? <Banner kind="info" text={OUTING.changed(formatOutingDay(outing.startsAt))} /> : null}
        <OutingFacts outing={outing} />
        {invited.length === 0 ? <Text color="muted">{PERMISSION_COPY.notInvited}</Text> : null}
        {permissions.map(({ child, permission: childState }) => (
          <ChildPermissionBlock
            key={child.id}
            child={child}
            outing={outing}
            permission={childState}
            history={permissionHistory(answers, child.id)}
            signerName={guardian.fullName}
            saving={state.savingChildId === child.id}
            failure={state.failure?.childId === child.id ? state.failure.reason : null}
            justSigned={state.signedChildId === child.id}
            showChip={single === null}
            showAnswers={single === null}
            onAnswer={(intent) => openConfirm(child.id, intent)}
            onCallNursery={callNursery}
          />
        ))}
      </Screen>

      {singleNeedsAnswer && single ? (
        <View style={[styles.footer, footerBottomPadding(insets.bottom)]}>
          <PermissionAnswers saving={state.savingChildId === single.child.id} onAnswer={(intent) => openConfirm(single.child.id, intent)} />
        </View>
      ) : null}

      <PermissionConfirmSheet
        intent={state.confirm?.intent ?? null}
        child={confirmChild}
        outing={outing}
        signerName={guardian.fullName}
        onConfirm={confirmAnswer}
        onClose={() => dispatch({ type: PERMISSION_ACTIONS.CONFIRM_CLOSED })}
      />

      {state.toastVisible ? <Toast message={PERMISSION_COPY.signedToast} /> : null}
    </View>
  );
}
