import { useRouter } from 'expo-router';
import { useCallback, useEffect, useReducer } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AUTHORIZATION_QUESTION_MODES, AuthorizationQuestion } from '@/components/AuthorizationQuestion/AuthorizationQuestion';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { PUSH_PRIMER_ROUTE } from '@/constants/routes';
import { ChildStepHeader } from '@/features/first-sign-in-authorizations/components/ChildStepHeader/ChildStepHeader';
import { StepBar } from '@/features/first-sign-in-authorizations/components/StepBar/StepBar';
import { StepFooter } from '@/features/first-sign-in-authorizations/components/StepFooter/StepFooter';
import { FIRST_SIGN_IN_COPY } from '@/features/first-sign-in-authorizations/first-sign-in-copy';
import { FIRST_SIGN_IN_ACTIONS, firstSignInReducer, initialFirstSignInState } from '@/features/first-sign-in-authorizations/first-sign-in-reducer';
import { useFirstSignInAuthorizations } from '@/features/first-sign-in-authorizations/use-first-sign-in-authorizations';
import { AUTHORIZATION_KEYS, type AuthorizationKey } from '@/lib/authorizations';
import { childAuthorizationStatuses, firstSignInFooterLine } from '@/lib/child-authorization-status';
import { firstSignInStepChildIds, isAnsweredByAnotherGuardian } from '@/lib/first-sign-in-authorizations';

import { QUESTION_SKELETON_HEIGHT, stepEntering, styles } from './FirstSignInAuthorizationsScreen.styles';

export function FirstSignInAuthorizationsScreen() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { data, loading, failed, reload, answer } = useFirstSignInAuthorizations();
  const [state, dispatch] = useReducer(firstSignInReducer, initialFirstSignInState);

  const finish = useCallback(() => router.replace(PUSH_PRIMER_ROUTE), [router]);

  useEffect(() => {
    if (data) dispatch({ type: FIRST_SIGN_IN_ACTIONS.STEPS_FIXED, stepChildIds: firstSignInStepChildIds(data.kids, data.rows) });
  }, [data]);

  useEffect(() => {
    if (state.stepChildIds?.length === 0) finish();
  }, [state.stepChildIds, finish]);

  useEffect(() => {
    if (!state.savedToastVisible) return;
    const timer = setTimeout(() => dispatch({ type: FIRST_SIGN_IN_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.savedToastVisible]);

  const stepChildIds = state.stepChildIds ?? [];
  const kidAt = (stepIndex: number) => data?.kids.find((candidate) => candidate.id === stepChildIds[stepIndex]) ?? null;
  const kid = kidAt(state.stepIndex);
  const nextKid = kidAt(state.stepIndex + 1);
  const previousKid = state.stepIndex > 0 ? kidAt(state.stepIndex - 1) : null;
  const status = kid && data ? childAuthorizationStatuses(data.rows, [kid.id], data.ownFirstName)[0] : null;

  async function saveAnswer(childId: string, key: AuthorizationKey, accepted: boolean) {
    await answer(childId, key, accepted);
    dispatch({ type: FIRST_SIGN_IN_ACTIONS.ANSWER_SAVED });
  }

  function continueFromStep() {
    if (nextKid) dispatch({ type: FIRST_SIGN_IN_ACTIONS.NEXT_STEP });
    else finish();
  }

  return (
    <View style={styles.root}>
      <Screen
        bleed
        header={
          <StepBar
            stepIndex={state.stepIndex}
            stepCount={stepChildIds.length}
            previousChildFirstName={previousKid?.firstName ?? null}
            onBack={() => dispatch({ type: FIRST_SIGN_IN_ACTIONS.PREVIOUS_STEP })}
            onLater={finish}
          />
        }>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {failed && !data && (
            <View style={styles.error}>
              <Text color="red">{FIRST_SIGN_IN_COPY.loadError}</Text>
              <Button label={FIRST_SIGN_IN_COPY.retry} variant="soft" onPress={reload} />
            </View>
          )}
          {loading && AUTHORIZATION_KEYS.map((key) => <Skeleton key={key} height={QUESTION_SKELETON_HEIGHT} />)}
          {kid && status && (
            <Animated.View key={kid.id} entering={stepEntering(state.lastMove, reduced)} style={styles.step}>
              <ChildStepHeader kid={kid} />
              {state.stepIndex === 0 && (
                <Text variant="small" style={styles.lede}>
                  {FIRST_SIGN_IN_COPY.lede}
                </Text>
              )}
              {status.items.map((item) => (
                <AuthorizationQuestion
                  key={item.key}
                  item={item}
                  childFirstName={kid.firstName}
                  childFullName={[kid.firstName, kid.lastName].filter(Boolean).join(' ')}
                  mode={isAnsweredByAnotherGuardian(item) ? AUTHORIZATION_QUESTION_MODES.readOnly : AUTHORIZATION_QUESTION_MODES.ask}
                  onAnswer={(accepted) => saveAnswer(kid.id, item.key, accepted)}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
        {kid && status && (
          <StepFooter
            line={firstSignInFooterLine(status.unansweredCount, kid.firstName)}
            buttonLabel={nextKid ? FIRST_SIGN_IN_COPY.next(nextKid.firstName) : FIRST_SIGN_IN_COPY.done}
            onContinue={continueFromStep}
          />
        )}
      </Screen>
      {state.savedToastVisible && <Toast message={FIRST_SIGN_IN_COPY.saved} />}
    </View>
  );
}
