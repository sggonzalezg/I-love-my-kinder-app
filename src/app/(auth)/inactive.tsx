import { ContactNurseryNotice } from '@/components/contact-nursery-notice';

export default function InactiveTeacherScreen() {
  return (
    <ContactNurseryNotice
      title="Tu cuenta está inactiva"
      message="No tienes acceso en este momento. Hablá con la dirección del jardín para activar tu cuenta."
    />
  );
}
