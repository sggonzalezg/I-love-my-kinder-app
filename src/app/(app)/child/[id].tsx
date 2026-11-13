import { useLocalSearchParams } from 'expo-router';

import { ChildFileScreen } from '@/features/child-file/screens/ChildFileScreen';

export default function ChildFileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ChildFileScreen childId={id} />;
}
