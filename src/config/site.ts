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
   * WhatsApp business number. International format, digits only, no plus
   * sign and no spaces, because wa.me rejects anything else.
   */
  whatsapp: {
    number: '919600785286',
    placeholder: false,
  },

  contact: {
    phone: '+91 96007 85286',
    phoneHref: 'tel:+919600785286',
    email: 'naveenplf001@gmail.com',
    placeholder: false,
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

  /** Default social preview. Overridden per page where a better frame exists. */
  defaultOgImage: '/brand/og-default.jpg',

  /** Shown beside the navigation on very wide screens. */
  positioning: ['Global materials.', 'Bespoke spaces.', 'Exceptional execution.'],

  locale: 'en_IN',
  language: 'en-IN',
} as const;

export type Site = typeof site;
