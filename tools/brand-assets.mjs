/**
 * Brand and hero asset generator.
 *
 * Two supplied SVGs were compared. "zen logo svg 1.svg" is a genuine vector
 * trace, but tracing turned the solid "zen" letterforms into outlines and
 * coarsened the arch, so it is not faithful to the mark. "zen-interior-logo(3).svg"
 * is a transparent PNG wrapped in an SVG envelope, and that PNG is the original
 * artwork at 1774x772. Fidelity wins over vector purity for a logo, so the
 * embedded PNG is extracted and used.
 *
 * Run: node tools/brand-assets.mjs
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SRC_SVG = 'brand-source/zen-interior-logo.svg';
const BRAND = 'public/brand';
const HOME = 'src/assets/images/home';
const HERO_SRC = 'brand-source/hero-original.png';

const IVORY = { r: 245, g: 241, b: 232 }; // #F5F1E8

await mkdir(BRAND, { recursive: true });
await mkdir(HOME, { recursive: true });
await mkdir('.tmp', { recursive: true });

/* ------------------------------------------------------------------ logo */

const svg = await readFile(SRC_SVG, 'utf8');
const match = svg.match(/href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/);
if (!match) throw new Error('No embedded PNG found in the supplied SVG.');

const originalPath = '.tmp/logo-original.png';
await writeFile(originalPath, Buffer.from(match[1], 'base64'));

const { width, height } = await sharp(originalPath).metadata();
console.log(`Source lockup: ${width}x${height}`);

// Full colour lockup, for ivory and stone grounds.
await sharp(originalPath)
  .resize({ width: 480 })
  .png({ compressionLevel: 9 })
  .toFile(`${BRAND}/zen-interior.png`);

// Reversed lockup for teal and dark grounds.
//
// The mark is two-tone, not a silhouette. The arch panel is a solid teal
// field and the yali inside it is drawn as light lines cut out of that field.
// Masking with the raw alpha channel would fill the panel solid and delete
// the animal entirely, so the mask has to come from luminance instead.
//
//   flatten on ivory -> greyscale -> negate
//
// gives a mask that is bright where the teal ink sits and dark where the
// paper and the cut-out linework sit. `linear` then stretches the two ends to
// true black and white while keeping the anti-aliased edges intact.
const TEAL_GREY = 38; // luminance of #01342F
const IVORY_GREY = 240; // luminance of #F5F1E8
const lo = 255 - IVORY_GREY;
const hi = 255 - TEAL_GREY;
const gain = 255 / (hi - lo);

const inkMask = await sharp(originalPath)
  .flatten({ background: IVORY })
  .greyscale()
  .negate({ alpha: false })
  .linear(gain, -lo * gain)
  .raw()
  .toBuffer();

const reversedFullSize = await sharp({
  create: { width, height, channels: 3, background: IVORY },
})
  .joinChannel(inkMask, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();

// Second pass for the resize: sharp resizes before it composites or joins, so
// doing both in one chain desynchronises the mask from the base.
await sharp(reversedFullSize)
  .resize({ width: 480 })
  .png({ compressionLevel: 9 })
  .toFile(`${BRAND}/zen-interior-reversed.png`);

// Mark only: the torana arch and yali, without the wordmark. Used for the
// favicon and any compact context where the lockup would be unreadable.
const markWidth = Math.round(width * 0.33);
await sharp(originalPath)
  .extract({ left: 0, top: 0, width: markWidth, height })
  .resize({ width: 256, height: 256, fit: 'contain', background: { ...IVORY, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(`${BRAND}/zen-mark.png`);

// Favicon: the mark on a teal ground, so it holds at 16px in a browser tab.
await sharp(originalPath)
  .extract({ left: 0, top: 0, width: markWidth, height })
  .resize({ width: 400, height: 400, fit: 'contain', background: { r: 1, g: 52, b: 47, alpha: 0 } })
  .extend({ top: 56, bottom: 56, left: 56, right: 56, background: { r: 1, g: 52, b: 47, alpha: 0 } })
  .flatten({ background: '#01342F' })
  .png({ compressionLevel: 9 })
  .toFile('public/favicon.png');

// Default social preview. Open Graph wants 1200x630, and this is what shows
// when a project link is shared on WhatsApp before a page-specific image exists.
await sharp(HERO_SRC)
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'attention' })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(`${BRAND}/og-default.jpg`);

console.log('Brand assets written to public/brand/');

/* ------------------------------------------------------------------ hero */

const heroMeta = await sharp(HERO_SRC).metadata();
console.log(`Hero source: ${heroMeta.width}x${heroMeta.height}`);

// Desktop hero. PNG at 2.5MB is pointless for a photograph, so it becomes JPEG
// and the build generates the AVIF and WebP derivatives from it.
await sharp(HERO_SRC)
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(`${HOME}/hero.jpg`);

// Mobile hero. A separate 4:5 crop, not the desktop frame squeezed down.
// Offset chosen so the seating, the table and the open view all survive.
const mobileHeight = heroMeta.height;
const mobileWidth = Math.round((mobileHeight * 4) / 5);
await sharp(HERO_SRC)
  .extract({ left: 500, top: 0, width: mobileWidth, height: mobileHeight })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(`${HOME}/hero-mobile.jpg`);

console.log(`Hero written: desktop ${heroMeta.width}x${heroMeta.height}, mobile ${mobileWidth}x${mobileHeight}`);
