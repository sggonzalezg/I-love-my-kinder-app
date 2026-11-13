import { useLocalSearchParams } from 'expo-router';

import { ChildDayScreen } from '@/features/child-day/screens/ChildDayScreen';

export default function DayRoute() {
  const { childId } = useLocalSearchParams<{ childId: string }>();
  return <ChildDayScreen childId={childId} />;
}
