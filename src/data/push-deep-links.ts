import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { pushDataToHref } from '@/lib/push-deep-link';

function openTappedPush(response: Notifications.NotificationResponse) {
  const href = pushDataToHref(response.notification.request.content.data);
  if (href) router.push(href);
}

/** Opens the screen of a tapped push, also when the tap started the app; signed out, the tap only opens the app. */
export function useOpenTappedPush(userId: string | undefined) {
  useEffect(() => {
    if (!userId || Platform.OS === 'web') return;
    const coldStartResponse = Notifications.getLastNotificationResponse();
    if (coldStartResponse) {
      // Cleared so a later sign-in on this run does not open the same push again.
      Notifications.clearLastNotificationResponse();
      openTappedPush(coldStartResponse);
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(openTappedPush);
    return () => subscription.remove();
  }, [userId]);
}
