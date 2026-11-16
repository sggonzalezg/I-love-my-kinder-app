import { Redirect, useLocalSearchParams } from 'expo-router';

import { LOGIN_ROUTE } from '@/constants/routes';
import { EmailCodeScreen } from '@/features/email-sign-in/screens/EmailCodeScreen';

export default function EmailCodeRoute() {
  const { email, waiting } = useLocalSearchParams<{ email?: string; waiting?: string }>();
  if (!email) return <Redirect href={LOGIN_ROUTE} />;
  return <EmailCodeScreen email={email} startsWaiting={!!waiting} />;
}
