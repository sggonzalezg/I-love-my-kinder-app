import { useLocalSearchParams } from 'expo-router';

import { ChildGroupFormScreen } from '@/features/director-children/screens/ChildGroupFormScreen';

export default function ChildGroupFormRoute() {
  const { childId, enrollmentId } = useLocalSearchParams<{ childId: string; enrollmentId?: string }>();
  return <ChildGroupFormScreen childId={childId} enrollmentId={enrollmentId ?? null} />;
}
