import { useRouter, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useReducer } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { activatePushNotifications } from '@/data/push-tokens';
import { LockScreenPreview } from '@/features/push-primer/components/LockScreenPreview/LockScreenPreview';
import { PUSH_PRIMER_COPY } from '@/features/push-primer/push-primer-copy';
import { PUSH_PRIMER_ACTIONS, initialPushPrimerState, pushPrimerReducer } from '@/features/push-primer/push-primer-reducer';

import { bottomInsetStyle, styles } from './PushPrimerScreen.styles';

const HOME_ROUTE = '/(app)' as Href;

export function PushPrimerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [{ activating }, dispatch] = useReducer(pushPrimerReducer, initialPushPrimerState);

  const goHome = () => router.replace(HOME_ROUTE);

  async function activate() {
    dispatch({ type: PUSH_PRIMER_ACTIONS.ACTIVATION_STARTED });
    await activatePushNotifications();
    dispatch({ type: PUSH_PRIMER_ACTIONS.ACTIVATION_FINISHED });
    goHome();
  }

  return (
    <View style={[styles.root, bottomInsetStyle(insets.bottom)]}>
      <StatusBar style="light" />
      <LockScreenPreview />
      <View style={styles.actions}>
        <Text variant="title" color="white" accessibilityRole="header" style={styles.title}>
          {PUSH_PRIMER_COPY.title}
        </Text>
        <Button label={PUSH_PRIMER_COPY.activate} onPress={activate} loading={activating} block />
        <Button label={PUSH_PRIMER_COPY.later} variant="plain" onPress={goHome} disabled={activating} block />
      </View>
    </View>
  );
}
