import { STORE_WHATSAPP } from '@/lib/supabase';
import type { CartItem } from '@/types';

export function buildAppointmentWhatsAppMessage(
  name: string,
  phone: string,
  date: string,
  slot: string
): string {
  return [
    '*Shivansh Optical & Eye Clinic*',
    '*New Eye Test Appointment*',
    '-----------------------------',
    `Patient Name: ${name}`,
    `Phone: ${phone}`,
    `Date: ${date}`,
    `Time Slot: ${slot}`,
    '-----------------------------',
    'Please confirm this appointment. Thank you!',
  ].join('\n');
}

export function buildOrderWhatsAppMessage(
  name: string,
  phone: string,
  items: CartItem[],
  total: number
): string {
  const itemLines = items.map(
    (item, i) =>
      `${i + 1}. ${item.product.name} (${item.product.brand}) - ${item.selectedColor} x${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
  ).join('\n');

  return [
    '*Shivansh Optical & Eye Clinic*',
    '*New Order Enquiry*',
    '-----------------------------',
    `Customer Name: ${name}`,
    `Phone: ${phone}`,
    '',
    'Items:',
    itemLines,
    '',
    `Total: ₹${total.toLocaleString('en-IN')}`,
    '-----------------------------',
    'Please confirm this order. Thank you!',
  ].join('\n');
}

export function openWhatsApp(message: string, phone: string = STORE_WHATSAPP) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
