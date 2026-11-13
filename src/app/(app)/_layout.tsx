import { Redirect, Stack } from 'expo-router';

import { LOGIN_ROUTE } from '@/constants/routes';
import { useSession } from '@/data/session';

export default function AppLayout() {
  const { session } = useSession();
  if (!session) return <Redirect href={LOGIN_ROUTE} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
