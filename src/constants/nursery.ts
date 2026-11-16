export const NURSERY_WHATSAPP_URL = 'https://wa.me/59892545120';

export function nurseryWhatsAppUrlWithMessage(message: string): string {
  return `${NURSERY_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
