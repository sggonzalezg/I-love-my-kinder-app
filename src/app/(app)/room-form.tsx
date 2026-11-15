import { useLocalSearchParams } from 'expo-router';

import { RoomFormScreen } from '@/features/director-rooms/screens/RoomFormScreen';

export default function RoomFormRoute() {
  const { id, name, age } = useLocalSearchParams<{ id?: string; name?: string; age?: string }>();
  return <RoomFormScreen roomId={id ?? null} initialValues={{ name: name ?? '', age: age ?? '' }} />;
}
