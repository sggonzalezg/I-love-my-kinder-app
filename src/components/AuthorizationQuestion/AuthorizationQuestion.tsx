import * as Haptics from 'expo-haptics';
import { Image as ImageIcon, Shield, type LucideIcon } from 'lucide-react-native';
import { useEffect, useReducer } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AuthorizationTextSheet } from '@/components/AuthorizationTextSheet/AuthorizationTextSheet';
import { Switch } from '@/components/switch';
import { Text } from '@/components/text';
import { CHILD_AUTHORIZATIONS } from '@/legal/texts';
import type { AuthorizationKey } from '@/lib/authorizations';
import { answeredLine, authorizationPurpose, readOnlyAnsweredLine, type ChildAuthorizationItem } from '@/lib/child-authorization-status';
import { AUTHORIZATION_STATES } from '@/lib/child-authorizations';
import { iconStroke } from '@/theme/tokens';
import { useColors } from '@/theme/use-theme';

import { QUESTION_ICON_SIZE, ringTransition, styles, useQuestionColorStyles } from './AuthorizationQuestion.styles';
import {
  AUTHORIZATION_QUESTION_ACTIONS,
  AUTHORIZATION_SHEETS,
  authorizationQuestionReducer,
  initialAuthorizationQuestionState,
} from './authorization-question-reducer';
import { AnswerPair } from './components/AnswerPair/AnswerPair';
import { AuthorizationStateChip } from './components/AuthorizationStateChip/AuthorizationStateChip';
import { WithdrawSheet } from './components/WithdrawSheet/WithdrawSheet';

export const AUTHORIZATION_QUESTION_MODES = { ask: 'ask', switch: 'switch', readOnly: 'readOnly' } as const;
export type AuthorizationQuestionMode = (typeof AUTHORIZATION_QUESTION_MODES)[keyof typeof AUTHORIZATION_QUESTION_MODES];

const AUTHORIZATION_ICONS: Record<AuthorizationKey, LucideIcon> = { image: ImageIcon, health: Shield };
const SAVE_ERROR = 'No pudimos guardar. Probá de nuevo.';

interface AuthorizationQuestionProps {
  item: ChildAuthorizationItem;
  childFirstName: string;
  childFullName: string;
  /** ask: the Sí / No pair (F3a); switch: the pair until answered, then a switch (F3); readOnly: another guardian already answered (F3a). */
  mode: AuthorizationQuestionMode;
  /** Rejects when the answer could not be saved. */
  onAnswer: (accepted: boolean) => Promise<void>;
}

export function AuthorizationQuestion({ item, childFirstName, childFullName, mode, onAnswer }: AuthorizationQuestionProps) {
  const colors = useColors();
  const colorStyles = useQuestionColorStyles();
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(authorizationQuestionReducer, item.state, initialAuthorizationQuestionState);

  useEffect(() => {
    dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.SYNCED, answer: item.state });
  }, [item.state]);

  async function save(accepted: boolean) {
    try {
      await onAnswer(accepted);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.SAVE_SUCCEEDED });
    } catch (error) {
      console.warn('answer_child_authorization failed:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.SAVE_FAILED });
    }
  }

  function answerNo() {
    dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.NO_TAPPED });
    save(false);
  }

  function confirmAccept() {
    dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.ACCEPT_CONFIRMED });
    save(true);
  }

  function confirmWithdraw() {
    dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.WITHDRAW_CONFIRMED });
    save(false);
  }

  const closeSheet = () => dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.SHEET_CLOSED });
  const { title } = CHILD_AUTHORIZATIONS[item.key];
  const Icon = AUTHORIZATION_ICONS[item.key];
  const isUnanswered = state.answer === AUTHORIZATION_STATES.unanswered;
  const isReadOnly = mode === AUTHORIZATION_QUESTION_MODES.readOnly;
  const showsSwitch = mode === AUTHORIZATION_QUESTION_MODES.switch && !isUnanswered;
  const line = isReadOnly ? readOnlyAnsweredLine(item) : answeredLine(item);

  return (
    <Animated.View style={[styles.block, colorStyles.block, isUnanswered ? colorStyles.ringUnanswered : colorStyles.ringAnswered, !reduced && ringTransition]}>
      <View style={styles.head}>
        <View style={[styles.iconCircle, colorStyles.iconCircle]}>
          <Icon size={QUESTION_ICON_SIZE} color={colors.blue} strokeWidth={iconStroke.regular} />
        </View>
        <View style={styles.headText}>
          <Text style={styles.title}>{title}</Text>
          <Text variant="small">{authorizationPurpose(item.key, childFirstName)}</Text>
        </View>
        {showsSwitch && (
          <Switch
            value={state.answer === AUTHORIZATION_STATES.granted}
            label={title}
            saving={state.saving}
            onChange={() => dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.SWITCH_TOGGLED })}
          />
        )}
      </View>

      {!showsSwitch && (
        <AnswerPair
          title={title}
          answer={state.answer}
          disabled={isReadOnly || state.saving}
          onYes={() => dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.YES_TAPPED })}
          onNo={answerNo}
        />
      )}

      {line && !isUnanswered && (
        <Text variant="caption" color="muted" numeric>
          {line}
        </Text>
      )}
      {state.failed && (
        <Text variant="small" color="red" accessibilityLiveRegion="polite">
          {SAVE_ERROR}
        </Text>
      )}

      <View style={styles.foot}>
        <AuthorizationStateChip state={state.answer} />
        <Pressable
          style={styles.readLink}
          hitSlop={8}
          accessibilityRole="link"
          onPress={() => dispatch({ type: AUTHORIZATION_QUESTION_ACTIONS.READ_TAPPED })}>
          <Text variant="smallStrong" color="blue">
            Ver texto completo
          </Text>
        </Pressable>
      </View>

      <AuthorizationTextSheet
        authorizationKey={state.sheet === AUTHORIZATION_SHEETS.accept || state.sheet === AUTHORIZATION_SHEETS.read ? item.key : null}
        childFullName={childFullName}
        onClose={closeSheet}
        onAccept={state.sheet === AUTHORIZATION_SHEETS.accept ? confirmAccept : undefined}
        saving={state.saving}
      />
      <WithdrawSheet
        visible={state.sheet === AUTHORIZATION_SHEETS.withdraw}
        authorizationTitle={title}
        childFirstName={childFirstName}
        onConfirm={confirmWithdraw}
        onClose={closeSheet}
      />
    </Animated.View>
  );
}
