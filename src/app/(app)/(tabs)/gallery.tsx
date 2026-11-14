import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/data/session';
import { DirectorGalleryScreen } from '@/features/director-gallery/screens/DirectorGalleryScreen';
import { FamilyGalleryScreen } from '@/features/gallery/family-gallery-screen';
import { TeacherUploadScreen } from '@/features/teacher-upload/screens/TeacherUploadScreen';

export default function GalleryTab() {
  const { session } = useSession();
  if (session?.active_role === 'family') return <FamilyGalleryScreen />;
  if (session?.active_role === 'teacher') return <TeacherUploadScreen />;
  if (session?.active_role === 'director') return <DirectorGalleryScreen />;
  return <PlaceholderScreen title="Galería" note="Acá van a estar las fotos y videos de la sala." />;
}
