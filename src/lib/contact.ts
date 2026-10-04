import { site } from "@/data/site";

/** Direct WhatsApp chat with an optional pre-filled message. */
export function whatsappHref(message: string = site.whatsappGreeting) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Direct dial link for the advisory line. */
export function telHref(phone: string = site.phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
