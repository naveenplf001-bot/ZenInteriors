import { site } from '@config/site';
import type { Enquiry } from './enquiry';

/**
 * WhatsApp deep linking.
 *
 * The site never sends a message. It pre-fills one and hands it to the
 * visitor, who presses Send. That is the only implementation that does not
 * require a backend or a Business API account.
 */

const WA_BASE = 'https://wa.me';

/** WhatsApp renders *asterisks* as bold. */
function bold(text: string): string {
  return `*${text}*`;
}

export function buildEnquiryMessage(enquiry: Enquiry): string {
  const lines: string[] = [
    bold('New Interior Project Enquiry'),
    '',
    `Name: ${enquiry.name.trim()}`,
    `Phone: ${enquiry.phone.trim()}`,
    `Email: ${enquiry.email.trim()}`,
    `Location: ${enquiry.location.trim()}`,
    `Project Type: ${enquiry.projectType}`,
    `Investment: ${enquiry.investment}`,
  ];

  const requirements = enquiry.requirements.trim();
  if (requirements) {
    lines.push('', bold('Requirements'), requirements);
  }

  lines.push('', `Sent from ${site.url.replace(/^https?:\/\//, '')}`);

  return lines.join('\n');
}

export function buildWhatsAppUrl(enquiry: Enquiry): string {
  const text = encodeURIComponent(buildEnquiryMessage(enquiry));
  return `${WA_BASE}/${site.whatsapp.number}?text=${text}`;
}

/** A plain conversation opener, for the footer and any direct contact link. */
export function buildDirectWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(
    message ?? `Hello ${site.name}, I would like to discuss a project.`,
  );
  return `${WA_BASE}/${site.whatsapp.number}?text=${text}`;
}

/**
 * Opens WhatsApp.
 *
 * This MUST be called synchronously inside the click or submit handler.
 * Any awaited call before it puts the window.open outside the user gesture,
 * and Safari and Chrome then block it with no visible error.
 */
export function openWhatsApp(url: string): void {
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  // Popup blocked anyway, or an in-app browser that disallows new windows.
  if (!opened) window.location.href = url;
}
