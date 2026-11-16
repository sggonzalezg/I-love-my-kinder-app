import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/data/session';
import { DirectorSalaScreen } from '@/features/director-rooms/screens/DirectorSalaScreen';
import { FamilyRoomScreen } from '@/features/family/family-room-screen';
import { TeacherRoomScreen } from '@/features/teacher-room/screens/TeacherRoomScreen';

export default function RoomTab() {
  const { session } = useSession();
  if (session?.active_role === 'family') return <FamilyRoomScreen />;
  if (session?.active_role === 'teacher') return <TeacherRoomScreen />;
  if (session?.active_role === 'director') return <DirectorSalaScreen />;
  return <PlaceholderScreen title="Sala" note="Acá vas a ver la sala, sus maestras y los cumpleaños." />;
}
