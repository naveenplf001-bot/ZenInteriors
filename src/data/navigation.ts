/**
 * Navigation is deliberately short. Luxury brands reduce choices.
 * Six destinations plus one primary action.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export const primaryAction: NavLink = {
  label: 'Start Your Project',
  href: '/contact',
};

/**
 * Footer columns.
 *
 * Typology links deep-link into the projects filter via `?category=`, which
 * the projects index reads on load. Every value here must match a slugified
 * entry in PROJECT_CATEGORIES, or the link lands on an empty filter.
 */
export const footerNav: Array<{ heading: string; links: NavLink[] }> = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Projects', href: '/projects' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Our Process', href: '/about#process' },
      { label: 'Journal', href: '/journal' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Our Work',
    links: [
      { label: 'Private Residences', href: '/projects?category=private-residence' },
      { label: 'Luxury Villas', href: '/projects?category=luxury-villa' },
      { label: 'Apartments', href: '/projects?category=apartment' },
      { label: 'Commercial Spaces', href: '/projects?category=commercial' },
      { label: 'Hospitality', href: '/projects?category=hospitality' },
      { label: 'Workspaces', href: '/projects?category=office' },
    ],
  },
];

/**
 * Returns true when `href` is the current page or an ancestor of it,
 * so `/projects/the-quiet-villa` still marks Projects as active.
 */
export function isActive(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}
