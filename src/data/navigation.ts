/**
 * Navigation is deliberately short. Luxury brands reduce choices.
 * Four destinations plus one primary action.
 */

export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export const primaryAction: NavLink = {
  label: 'Start Your Project',
  href: '/contact',
};

export const footerNav: Array<{ heading: string; links: NavLink[] }> = [
  {
    heading: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Work',
    links: [
      { label: 'All Projects', href: '/projects' },
      { label: 'Private Residences', href: '/projects?category=private-residence' },
      { label: 'Commercial Spaces', href: '/projects?category=commercial' },
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
