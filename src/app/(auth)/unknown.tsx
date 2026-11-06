import { ContactNurseryNotice } from '@/components/contact-nursery-notice';

export default function UnknownNumberScreen() {
  return (
    <ContactNurseryNotice
      title="I love my kinder no activó tu cuenta aún"
      message="Es posible que no estés inscripto todavía, o tu maestra registró mal el número."
    />
  );
}
