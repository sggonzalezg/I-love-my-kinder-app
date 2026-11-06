import { useLocalSearchParams } from 'expo-router';

import { AuthorizationsScreen } from '@/features/family/authorizations-screen';

export default function AuthorizationsRoute() {
  const { childId, name } = useLocalSearchParams<{ childId: string; name: string }>();
  return <AuthorizationsScreen childId={childId} childName={name ?? ''} />;
}
