import { Redirect, useLocalSearchParams } from 'expo-router';

import { LOGIN_ROUTE } from '@/constants/routes';
import { AccountNotEnabledScreen } from '@/features/email-sign-in/screens/AccountNotEnabledScreen';

export default function AccountNotEnabledRoute() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  if (!email) return <Redirect href={LOGIN_ROUTE} />;
  return <AccountNotEnabledScreen email={email} />;
}
