import { useLocalSearchParams } from 'expo-router';

import { AUTHORIZATIONS_FROM_TODAY } from '@/constants/routes';
import { focusKeyFromParam } from '@/features/child-authorizations/child-authorizations-copy';
import { ChildAuthorizationsScreen } from '@/features/child-authorizations/screens/ChildAuthorizationsScreen';

export default function AuthorizationsRoute() {
  const { childId, name, focus, from } = useLocalSearchParams<{ childId: string; name?: string; focus?: string; from?: string }>();
  return (
    <ChildAuthorizationsScreen
      childId={childId}
      childFirstName={name ?? ''}
      focusKey={focusKeyFromParam(focus)}
      openedFromToday={from === AUTHORIZATIONS_FROM_TODAY}
    />
  );
}
