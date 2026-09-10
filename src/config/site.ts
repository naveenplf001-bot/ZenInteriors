/**
 * Single source of truth for company identity, contact routing and URLs.
 *
 * Nothing in this file may be duplicated inside a component. When the client
 * supplies real details, this is the only file that changes.
 */

export const site = {
  name: 'Zen Interior',
  legalName: 'Zen Interior',
  url: 'https://zeninterior.in',

  tagline: 'Global materials. Local craftsmanship. Exceptional spaces.',
  description:
    'Zen Interior is a premium interior design, global sourcing and turnkey execution studio creating considered residential and commercial spaces across Tamil Nadu and Bangalore.',

  /**
   * REQUIRED CONFIGURATION — replace before the site is shown to the client.
   * International format, digits only, no plus sign, no spaces.
   * The value below is a placeholder and will not reach a real inbox.
   */
  whatsapp: {
    number: '910000000000',
    placeholder: true,
  },

  /** REQUIRED CONFIGURATION — replace with real business contact details. */
  contact: {
    phone: '+91 00000 00000',
    phoneHref: 'tel:+910000000000',
    email: 'studio@zeninterior.in',
    placeholder: true,
  },

  /**
   * Service geography. Kept as data so the footer, About page and service
   * section stay in agreement, and so cities can expand as projects land.
   */
  regions: [
    {
      name: 'Tamil Nadu',
      cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
    },
    {
      name: 'Karnataka',
      cities: ['Bangalore'],
    },
  ],

  /** Only add a channel once it genuinely exists. Empty is better than dead. */
  social: [] as Array<{ label: string; href: string }>,

  /** Default social preview image, replaced once brand photography lands. */
  defaultOgImage: '/brand/og-default.jpg',

  locale: 'en_IN',
  language: 'en-IN',
} as const;

export type Site = typeof site;
