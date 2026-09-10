/**
 * One-off importer for the supplied photography.
 *
 * Copies the originals into the project image folders under their final
 * names. Files are copied byte for byte with no resizing or recompression,
 * because the Astro build generates every derivative from the original and
 * starting from a degraded file only degrades the derivatives.
 *
 * Run: node tools/import-images.mjs
 */

import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCE = 'C:/Users/MEGHALA/Downloads/zen images';
const TARGET = new URL('../src/assets/images/', import.meta.url).pathname.replace(/^\//, '');

/**
 * Deliberately excluded: "hero section reference.jpeg" is a website design
 * mockup, not photography. It does not belong in the image pipeline.
 *
 * Also note "bedroom 3.jpeg" is byte-identical to "bed 3.jpeg", so only one
 * of the pair is imported.
 */
const MAP = {
  // Homepage
  'home/hero.jpg': 'main hall 1.jpeg',
  'home/hero-mobile.jpg': 'space 2.jpeg',
  'home/sourcing.jpg': 'design2.jpeg',
  'home/materials.jpg': 'kitchen.jpeg',

  // The Quiet Villa — the dramatic marble and bronze set.
  // Kept strictly to this family. Mixing a warm timber bedroom into a dark
  // marble house reads as a stock gallery, not one project.
  'projects/the-quiet-villa/cover.jpg': 'main hall 2.jpeg',
  'projects/the-quiet-villa/01-living-volume.jpg': 'main hall3.jpeg',
  'projects/the-quiet-villa/02-lounge.jpg': 'main hall 1.jpeg',

  // The Emerald Residence — the warm timber set
  'projects/the-emerald-residence/cover.jpg': 'hall.jpeg',
  'projects/the-emerald-residence/01-threshold.jpg': 'space 2.jpeg',
  'projects/the-emerald-residence/02-principal-bedroom.jpg': 'beedroom2.jpeg',
  'projects/the-emerald-residence/03-second-bedroom.jpg': 'beedroom.jpeg',
  'projects/the-emerald-residence/04-childs-room.jpg': 'child bedroom.jpeg',
  'projects/the-emerald-residence/05-resting-area.jpg': 'resting place.jpeg',
  'projects/the-emerald-residence/06-bedroom-detail.jpg': 'bed 3.jpeg',

  // The Slate Apartment — the contemporary lacquer and stone set
  'projects/the-slate-apartment/cover.jpg': 'design.jpeg',
  'projects/the-slate-apartment/01-kitchen.jpg': 'kitchen.jpeg',
  'projects/the-slate-apartment/02-kitchen-detail.jpg': 'kitchen2.jpeg',
  'projects/the-slate-apartment/03-entrance-joinery.jpg': 'design2.jpeg',

  // Journal
  'journal/the-art-of-quiet-luxury/cover.jpg': 'main hall3.jpeg',
  'journal/imported-materials-are-not-enough/cover.jpg': 'kitchen2.jpeg',
  'journal/the-architecture-of-storage/cover.jpg': 'design2.jpeg',

  // About
  'about/hero.jpg': 'main hall 1.jpeg',
  'about/craft.jpg': 'design.jpeg',
};

// Placeholder folders replaced by this import.
const REMOVE = [
  'projects/atelier-workspace',
  'projects/the-quiet-villa',
  'projects/the-emerald-residence',
  'projects/the-slate-apartment',
  'journal/the-art-of-quiet-luxury',
  'journal/imported-materials-are-not-enough',
  'journal/the-architecture-of-storage',
  'home',
  'about',
];

console.log('Clearing placeholder imagery…');
for (const dir of REMOVE) {
  await rm(join(TARGET, dir), { recursive: true, force: true });
}

console.log('Importing supplied photography…');
for (const [destination, filename] of Object.entries(MAP)) {
  const target = join(TARGET, destination);
  await mkdir(join(target, '..'), { recursive: true });
  await cp(join(SOURCE, filename), target);
  console.log(`  ${destination}  <-  ${filename}`);
}

console.log(`\n${Object.keys(MAP).length} files imported.`);
