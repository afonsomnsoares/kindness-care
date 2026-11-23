const WHATSAPP_NUMBER = '351968844420';

export function whatsAppHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || '')}`;
}
