import { Redirect, Stack } from 'expo-router';

import { LOGIN_ROUTE } from '@/constants/routes';
import { useOpenTappedPush } from '@/data/push-deep-links';
import { useRefreshPushToken } from '@/data/push-tokens';
import { useSession } from '@/data/session';

export default function AppLayout() {
  const { session } = useSession();
  useRefreshPushToken(session?.user_id);
  useOpenTappedPush(session?.user_id);
  if (!session) return <Redirect href={LOGIN_ROUTE} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
