import { Redirect } from 'expo-router';

import { LOGIN_ROUTE, PUSH_PRIMER_ROUTE } from '@/constants/routes';
import { useSession } from '@/data/session';
import { FirstSignInAuthorizationsScreen } from '@/features/first-sign-in-authorizations/screens/FirstSignInAuthorizationsScreen';
import { asksFirstSignInAuthorizations } from '@/lib/first-sign-in-authorizations';

export default function FirstSignInAuthorizationsRoute() {
  const { session } = useSession();
  if (!session) return <Redirect href={LOGIN_ROUTE} />;
  if (!asksFirstSignInAuthorizations(session.active_role)) return <Redirect href={PUSH_PRIMER_ROUTE} />;
  return <FirstSignInAuthorizationsScreen />;
}
