import { useLocalSearchParams } from 'expo-router';

import { focusKeyFromParam } from '@/features/child-authorizations/child-authorizations-copy';
import { ChildAuthorizationsScreen } from '@/features/child-authorizations/screens/ChildAuthorizationsScreen';

export default function AuthorizationsRoute() {
  const { childId, name, focus } = useLocalSearchParams<{ childId: string; name?: string; focus?: string }>();
  return <ChildAuthorizationsScreen childId={childId} childFirstName={name ?? ''} focusKey={focusKeyFromParam(focus)} />;
}
