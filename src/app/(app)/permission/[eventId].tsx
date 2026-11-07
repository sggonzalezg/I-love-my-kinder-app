import { useLocalSearchParams } from 'expo-router';

import { OutingPermissionScreen } from '@/features/outing-permission/outing-permission-screen';

export default function OutingPermissionRoute() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  return <OutingPermissionScreen eventId={eventId} />;
}
