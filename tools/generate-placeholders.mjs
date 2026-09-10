/**
 * Placeholder image generator — TEMPORARY.
 *
 * Produces flat brand-toned panels so the build is green and layouts can be
 * judged before real photography exists. These are not design assets. They are
 * scaffolding, and Phase 6 deletes this script along with everything it wrote.
 *
 * Run: node tools/generate-placeholders.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../src/assets/images/', import.meta.url).pathname.replace(/^\//, '');

// Brand tones, cycled so adjacent frames differ without becoming decorative.
const TONES = [
  { bg: '#E4DDD0', fg: '#01342F' },
  { bg: '#01342F', fg: '#C2AB84' },
  { bg: '#D5CABB', fg: '#171816' },
  { bg: '#0B0D0C', fg: '#A58A5B' },
  { bg: '#F5F1E8', fg: '#01342F' },
  { bg: '#002B27', fg: '#E4DDD0' },
];

function panel({ width, height, label, tone }) {
  const { bg, fg } = tone;
  const inset = Math.round(Math.min(width, height) * 0.055);
  const fontSize = Math.round(Math.min(width, height) * 0.032);

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="${bg}"/>
      <rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}"
            fill="none" stroke="${fg}" stroke-opacity="0.28" stroke-width="1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}"
            fill="${fg}" fill-opacity="0.55" letter-spacing="${fontSize * 0.28}">
        ${label}
      </text>
      <text x="50%" y="${height - inset * 1.4}" text-anchor="middle"
            font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(fontSize * 0.42)}"
            fill="${fg}" fill-opacity="0.4" letter-spacing="${fontSize * 0.14}">
        PLACEHOLDER
      </text>
    </svg>
  `);
}

async function write(relativePath, spec) {
  const target = join(ROOT, relativePath);
  await mkdir(dirname(target), { recursive: true });
  const buffer = await sharp(panel(spec)).jpeg({ quality: 82 }).toBuffer();
  await writeFile(target, buffer);
  console.log(`  ${relativePath}`);
}

// width, height, label, per gallery slot
const RATIOS = {
  hero: [2400, 1350],
  heroMobile: [1200, 1600],
  cover: [1600, 2000],
  wide: [2400, 1350],
  full: [2600, 1400],
  half: [1600, 1200],
  detail: [1400, 1400],
};

const PROJECTS = {
  'the-quiet-villa': [
    ['cover.jpg', 'cover', 'THE QUIET VILLA'],
    ['01-arrival.jpg', 'full', 'ARRIVAL'],
    ['02-living.jpg', 'wide', 'LIVING'],
    ['03-joinery.jpg', 'detail', 'JOINERY'],
    ['04-stair.jpg', 'half', 'STAIR'],
    ['05-kitchen.jpg', 'half', 'KITCHEN'],
    ['06-principal-bedroom.jpg', 'wide', 'PRINCIPAL BEDROOM'],
  ],
  'the-emerald-residence': [
    ['cover.jpg', 'cover', 'THE EMERALD RESIDENCE'],
    ['01-entrance.jpg', 'full', 'ENTRANCE'],
    ['02-living.jpg', 'wide', 'LIVING'],
    ['03-stone-detail.jpg', 'detail', 'STONE'],
    ['04-dining.jpg', 'half', 'DINING'],
    ['05-study.jpg', 'half', 'STUDY'],
  ],
  'atelier-workspace': [
    ['cover.jpg', 'cover', 'ATELIER WORKSPACE'],
    ['01-reception.jpg', 'full', 'RECEPTION'],
    ['02-studio-floor.jpg', 'wide', 'STUDIO FLOOR'],
    ['03-material-wall.jpg', 'detail', 'MATERIAL WALL'],
    ['04-meeting.jpg', 'half', 'MEETING'],
  ],
};

const JOURNAL = {
  'the-art-of-quiet-luxury': [['cover.jpg', 'wide', 'QUIET LUXURY']],
  'imported-materials-are-not-enough': [['cover.jpg', 'wide', 'SOURCING']],
  'the-architecture-of-storage': [['cover.jpg', 'wide', 'STORAGE']],
};

const HOME = [
  ['hero.jpg', 'hero', 'ZEN INTERIOR'],
  ['hero-mobile.jpg', 'heroMobile', 'ZEN INTERIOR'],
  ['sourcing.jpg', 'wide', 'GLOBAL SOURCING'],
  ['materials.jpg', 'cover', 'MATERIALS'],
];

const ABOUT = [
  ['hero.jpg', 'hero', 'THE STUDIO'],
  ['craft.jpg', 'wide', 'CRAFT'],
];

let tone = 0;
const nextTone = () => TONES[tone++ % TONES.length];

console.log('Generating placeholder imagery…');

for (const [slug, files] of Object.entries(PROJECTS)) {
  for (const [name, ratio, label] of files) {
    const [width, height] = RATIOS[ratio];
    await write(`projects/${slug}/${name}`, { width, height, label, tone: nextTone() });
  }
}

for (const [slug, files] of Object.entries(JOURNAL)) {
  for (const [name, ratio, label] of files) {
    const [width, height] = RATIOS[ratio];
    await write(`journal/${slug}/${name}`, { width, height, label, tone: nextTone() });
  }
}

for (const [name, ratio, label] of HOME) {
  const [width, height] = RATIOS[ratio];
  await write(`home/${name}`, { width, height, label, tone: nextTone() });
}

for (const [name, ratio, label] of ABOUT) {
  const [width, height] = RATIOS[ratio];
  await write(`about/${name}`, { width, height, label, tone: nextTone() });
}

console.log('Done. Replace every one of these before the client demo.');
