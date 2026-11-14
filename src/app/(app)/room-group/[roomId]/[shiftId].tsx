import { useLocalSearchParams } from 'expo-router';

import { DirectorGroupScreen } from '@/features/director-rooms/screens/DirectorGroupScreen';

export default function RoomGroupRoute() {
  const { roomId, shiftId } = useLocalSearchParams<{ roomId: string; shiftId: string }>();
  return <DirectorGroupScreen roomId={roomId} shiftId={shiftId} />;
}
