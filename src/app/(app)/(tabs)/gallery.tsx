import { PlaceholderScreen } from '@/components/placeholder-screen';
import { useSession } from '@/data/session';
import { FamilyGalleryScreen } from '@/features/gallery/family-gallery-screen';

export default function GalleryTab() {
  const { session } = useSession();
  if (session?.active_role === 'family') return <FamilyGalleryScreen />;
  return <PlaceholderScreen title="Galería" note="Acá van a estar las fotos y videos de la sala." />;
}
