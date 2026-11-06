import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/data/session';
import { FamilyRoomScreen } from '@/features/family/family-room-screen';

export default function RoomTab() {
  const { session } = useSession();
  if (session?.active_role === 'family') return <FamilyRoomScreen />;
  return <PlaceholderScreen title="Sala" note="Acá vas a ver la sala, sus maestras y los cumpleaños." />;
}
