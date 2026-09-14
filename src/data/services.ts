import type { ImageMetadata } from 'astro';

import kitchenImage from '@/assets/images/projects/the-slate-apartment/01-kitchen.jpg';
import wardrobeImage from '@/assets/images/projects/the-slate-apartment/03-entrance-joinery.jpg';
import officeImage from '@/assets/images/projects/the-emerald-residence/04-childs-room.jpg';
import outdoorImage from '@/assets/images/projects/the-emerald-residence/05-resting-area.jpg';
import softImage from '@/assets/images/home/hero.jpg';
import lightingImage from '@/assets/images/projects/the-quiet-villa/cover.jpg';

/**
 * The services page offer, in the order a client walks a home: kitchen,
 * storage, work, outdoors, living and light.
 */

export interface Service {
  index: string;
  title: string;
  description: string;
  image: ImageMetadata;
  alt: string;
}

export const services: Service[] = [
  {
    index: '01',
    title: 'Modular Kitchens',
    description: 'Functional. Beautiful. Built for the way you cook and live.',
    image: kitchenImage,
    alt: 'Handleless kitchen in warm grey with a lit bronze backsplash',
  },
  {
    index: '02',
    title: 'Wardrobes & Storage',
    description: 'Thoughtful storage for a calmer, more organised home.',
    image: wardrobeImage,
    alt: 'Floor-to-ceiling joinery with a lit timber niche',
  },
  {
    index: '03',
    title: 'Office Furniture',
    description: 'Workspaces designed for focus, productivity and well-being.',
    image: officeImage,
    alt: 'Built-in study desk beneath lit floating shelves',
  },
  {
    index: '04',
    title: 'Furniture – Outdoor',
    description: 'Elevated living, carried beyond the indoors.',
    image: outdoorImage,
    alt: 'Lounge chairs opening onto a planted courtyard',
  },
  {
    index: '05',
    title: 'Soft Furniture',
    description: 'Sofas and seating with comfort crafted into character.',
    image: softImage,
    alt: 'Deep curved sofa in a sunlit living room',
  },
  {
    index: '06',
    title: 'Lighting',
    description: 'Setting the perfect mood, in every space.',
    image: lightingImage,
    alt: 'Sculptural ring pendant over a warm living room',
  },
];

/**
 * Capabilities, as the about page states them: broadly, never itemised.
 */

export interface Capability {
  index: string;
  title: string;
  description: string;
}

export const capabilities: Capability[] = [
  {
    index: '01',
    title: 'Residential Interiors',
    description:
      'Complete environments for private residences, villas and apartments, resolved from architecture through to the final detail.',
  },
  {
    index: '02',
    title: 'Bespoke Furniture',
    description:
      'Pieces designed for a specific room, proportion and material palette, then built to a specification we control.',
  },
  {
    index: '03',
    title: 'Architectural Interiors',
    description:
      'Spatial planning, joinery, surfaces and lighting treated as one composition rather than separate trades.',
  },
  {
    index: '04',
    title: 'Material Sourcing',
    description:
      'Access to global manufacturing partners for surfaces, architectural elements and finishes rarely available locally.',
  },
  {
    index: '05',
    title: 'Commercial Spaces',
    description:
      'Workplaces, hospitality and retail interiors where brand, function and finish have to hold up under daily use.',
  },
  {
    index: '06',
    title: 'Turnkey Execution',
    description:
      'One accountable team from first drawing to handover, with sequencing, quality control and site supervision in-house.',
  },
];
