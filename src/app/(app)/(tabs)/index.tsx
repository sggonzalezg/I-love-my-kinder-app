import { useSession } from '@/data/session';
import { DirectorTodayScreen } from '@/features/director-today/screens/DirectorTodayScreen';
import { FamilyTodayScreen } from '@/features/family-today/screens/FamilyTodayScreen';
import { TeacherTodayScreen } from '@/features/teacher-day/screens/TeacherTodayScreen';

export default function IndexTab() {
  const { session } = useSession();
  if (session?.active_role === 'teacher') return <TeacherTodayScreen />;
  if (session?.active_role === 'director') return <DirectorTodayScreen />;
  return <FamilyTodayScreen />;
}
