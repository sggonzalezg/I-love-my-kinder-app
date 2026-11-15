import { useLocalSearchParams } from 'expo-router';

import { DirectorChildFileScreen } from '@/features/director-children/screens/DirectorChildFileScreen';

export default function DirectorChildFileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DirectorChildFileScreen childId={id} />;
}
