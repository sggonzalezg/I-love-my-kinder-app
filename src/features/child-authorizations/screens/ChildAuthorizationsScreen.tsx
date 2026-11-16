import { router } from 'expo-router';
import { useEffect, useReducer, useRef } from 'react';
import { ScrollView, View, type LayoutChangeEvent, type ScrollViewInstance } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { AUTHORIZATION_QUESTION_MODES, AuthorizationQuestion } from '@/components/AuthorizationQuestion/AuthorizationQuestion';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { Text } from '@/components/text';
import { Toast, TOAST_VISIBLE_MS } from '@/components/toast';
import { TopBar } from '@/components/top-bar';
import { AUTHORIZATION_KEYS, type AuthorizationKey } from '@/lib/authorizations';

import { CHILD_AUTHORIZATIONS_COPY, authorizationsCaption, authorizationsIntro, otherGuardianName } from '@/features/child-authorizations/child-authorizations-copy';
import {
  CHILD_AUTHORIZATIONS_ACTIONS,
  childAuthorizationsReducer,
  initialChildAuthorizationsState,
} from '@/features/child-authorizations/child-authorizations-reducer';
import { UnansweredBanner } from '@/features/child-authorizations/components/UnansweredBanner/UnansweredBanner';
import { useChildAuthorizations } from '@/features/child-authorizations/use-child-authorizations';

import { QUESTION_SKELETON_HEIGHT, styles } from './ChildAuthorizationsScreen.styles';

interface ChildAuthorizationsScreenProps {
  childId: string;
  /** Shown in the title while the child loads. */
  childFirstName: string;
  focusKey: AuthorizationKey | null;
}

export function ChildAuthorizationsScreen({ childId, childFirstName, focusKey }: ChildAuthorizationsScreenProps) {
  const { view, loading, failed, reload, answer } = useChildAuthorizations(childId);
  const [state, dispatch] = useReducer(childAuthorizationsReducer, initialChildAuthorizationsState);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!state.savedToastVisible) return;
    const timer = setTimeout(() => dispatch({ type: CHILD_AUTHORIZATIONS_ACTIONS.TOAST_HIDDEN }), TOAST_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [state.savedToastVisible]);

  function scrollToFocus(key: AuthorizationKey, event: LayoutChangeEvent) {
    if (key !== focusKey || state.focusScrolled) return;
    scrollRef.current?.scrollTo({ y: event.nativeEvent.layout.y, animated: !reduced });
    dispatch({ type: CHILD_AUTHORIZATIONS_ACTIONS.FOCUS_SCROLLED });
  }

  async function saveAnswer(key: AuthorizationKey, accepted: boolean) {
    await answer(key, accepted);
    dispatch({ type: CHILD_AUTHORIZATIONS_ACTIONS.ANSWER_SAVED });
  }

  const firstName = view?.childFirstName ?? childFirstName;
  const intro = view && authorizationsIntro(view.childFirstName, view.guardianCount);
  const caption = view && authorizationsCaption(view.childFirstName, view.guardianCount, otherGuardianName(view.status.items));

  return (
    <View style={styles.root}>
      <Screen
        bleed
        header={<TopBar title={CHILD_AUTHORIZATIONS_COPY.title(firstName)} backLabel={CHILD_AUTHORIZATIONS_COPY.back} onBack={() => router.back()} />}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
          {failed && !view && (
            <View style={styles.error}>
              <Text color="red">{CHILD_AUTHORIZATIONS_COPY.loadError}</Text>
              <Button label={CHILD_AUTHORIZATIONS_COPY.retry} variant="soft" onPress={reload} />
            </View>
          )}
          {loading && AUTHORIZATION_KEYS.map((key) => <Skeleton key={key} height={QUESTION_SKELETON_HEIGHT} />)}
          {view && (
            <>
              <UnansweredBanner unansweredCount={view.status.unansweredCount} />
              {intro && <Text variant="small">{intro}</Text>}
              {view.status.items.map((item) => (
                <View key={item.key} onLayout={(event) => scrollToFocus(item.key, event)}>
                  <AuthorizationQuestion
                    item={item}
                    childFirstName={view.childFirstName}
                    childFullName={view.childFullName}
                    mode={AUTHORIZATION_QUESTION_MODES.switch}
                    onAnswer={(accepted) => saveAnswer(item.key, accepted)}
                  />
                </View>
              ))}
              {caption && (
                <Text variant="caption" color="muted">
                  {caption}
                </Text>
              )}
            </>
          )}
        </ScrollView>
      </Screen>
      {state.savedToastVisible && <Toast message={CHILD_AUTHORIZATIONS_COPY.saved} />}
    </View>
  );
}
