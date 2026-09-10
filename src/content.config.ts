import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content collections.
 *
 * This file is the most important contract in the repository. It is the
 * interface a CMS will later implement. Today the loader reads markdown from
 * disk; tomorrow it can read from Sanity, Payload or a REST API, and every
 * component downstream keeps working because the shape does not change.
 *
 * Rule: nothing renders content it has not received through one of these
 * schemas. No project or article is ever hardcoded into a component.
 */

export const PROJECT_CATEGORIES = [
  'Private Residence',
  'Luxury Villa',
  'Apartment',
  'Commercial',
  'Hospitality',
  'Office',
] as const;

export const REGIONS = ['Tamil Nadu', 'Karnataka'] as const;

export const JOURNAL_CATEGORIES = [
  'Materials',
  'Design',
  'Craft',
  'Sourcing',
  'Living',
] as const;

/**
 * Gallery layout hint.
 *
 * The gallery is asymmetric by design, not a uniform grid. `span` lets the
 * content decide which frames carry weight, so a hero interior is not shown
 * at the same size as a joinery detail.
 */
const gallerySpan = z.enum(['full', 'wide', 'half', 'detail']).default('half');

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One editorial sentence. Used on cards, and as the Open Graph description. */
      summary: z.string().max(220),
      location: z.string(),
      region: z.enum(REGIONS),
      category: z.enum(PROJECT_CATEGORIES),
      year: z.number().int().min(2000).max(2100),
      scope: z.string(),

      cover: image(),
      coverAlt: z.string(),
      /** Separate portrait crop for mobile heroes. Never squeeze the desktop frame. */
      coverMobile: image().optional(),

      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
            span: gallerySpan,
          }),
        )
        .default([]),

      /** The design story. Two or three short paragraphs, not a brochure. */
      concept: z.string(),
      /** Material statements, e.g. "Italian travertine, honed and book-matched". */
      materials: z.array(z.string()).default([]),
      /** What Zen actually delivered on site. */
      execution: z.string(),
      highlights: z.array(z.string()).min(0).max(6).default([]),

      featured: z.boolean().default(false),
      /** Manual sequencing. Lower sorts first. */
      order: z.number().int().default(100),
      draft: z.boolean().default(false),
    }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(JOURNAL_CATEGORIES),

      /**
       * Roughly six lines on the card. Written to create curiosity, not to
       * summarise the article. If it answers the question, nobody clicks.
       */
      excerpt: z.string().min(180).max(560),

      cover: image(),
      coverAlt: z.string(),

      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('Zen Interior'),

      relatedProjects: z.array(reference('projects')).default([]),

      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, journal };
