import { site } from '@config/site';

/**
 * Metadata and structured data builders.
 *
 * Open Graph carries disproportionate weight here, because these links get
 * shared on WhatsApp. A project link must preview as the photograph and the
 * project name, never as "Home | Zen Interior".
 */

export interface PageMeta {
  title: string;
  description: string;
  /** Absolute or root-relative path. Resolved against site.url. */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  noindex?: boolean;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = site.url.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** The homepage keeps a standalone title. Every other page is suffixed. */
export function buildTitle(title: string, isHome = false): string {
  if (isHome) return title;
  return `${title} — ${site.name}`;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    logo: absoluteUrl('/brand/zen-interior-logo.svg'),
    areaServed: site.regions.map((region) => ({
      '@type': 'AdministrativeArea',
      name: region.name,
    })),
    ...(site.social.length > 0 ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt: Date | string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    datePublished:
      typeof input.publishedAt === 'string'
        ? input.publishedAt
        : input.publishedAt.toISOString(),
    author: { '@type': 'Organization', name: input.author },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/brand/zen-interior-logo.svg'),
      },
    },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
