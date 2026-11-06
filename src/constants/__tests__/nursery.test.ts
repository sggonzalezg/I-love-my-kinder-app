import { NURSERY_WHATSAPP_URL } from '@/constants/nursery';

describe('NURSERY_WHATSAPP_URL', () => {
  it('opens a WhatsApp chat with the nursery number 092545120 in international format', () => {
    expect(NURSERY_WHATSAPP_URL).toBe('https://wa.me/59892545120');
  });
});
