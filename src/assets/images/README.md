# Image assets

Everything photographic lives here, **not** in `public/`.

Files in `src/assets` pass through the Astro image pipeline, which generates AVIF and
WebP derivatives at several widths and emits correct `srcset` and dimensions. Files in
`public/` are copied verbatim and ship at full weight with no responsive variants. On a
photography-led site that difference is the whole performance budget.

`public/brand/` is the one exception. Logos, favicons and the default social preview
image belong there, because they must keep stable, predictable URLs.

## Folder structure

```
src/assets/images/
├── projects/
│   └── <project-slug>/          folder name matches the content filename
│       ├── cover.jpg            the card and hero image
│       ├── 01-living.jpg        gallery, numbered in display order
│       ├── 02-kitchen.jpg
│       └── 03-detail-brass.jpg
├── journal/
│   └── <article-slug>/
│       ├── cover.jpg
│       └── 01-*.jpg
├── home/                        hero and homepage section imagery
└── about/                       studio and process imagery
```

The project folder name must match the markdown filename in `src/content/projects/`.
A project at `src/content/projects/the-quiet-villa.md` uses
`src/assets/images/projects/the-quiet-villa/`.

## Naming

Use `NN-subject.jpg`, numbered in the order the image should appear.

```
01-entrance.jpg
02-living-room.jpg
03-detail-joinery.jpg
04-kitchen.jpg
```

Lowercase, hyphens, no spaces, no capitals, no `IMG_4821.JPG`. The number controls
gallery order, so renumbering reorders the gallery.

## What to supply

| Property | Requirement |
| --- | --- |
| Format | JPG for photography, PNG only for graphics with transparency |
| Longest edge | 2400px minimum, 3200px preferred for hero and full-bleed images |
| Colour space | sRGB |
| Compression | Supply near-original quality. Do not pre-compress. |
| Orientation | Bake in rotation. Do not rely on EXIF orientation. |

Do not resize or compress before handing images over. The build does that, and starting
from a degraded file only means the derivatives are degraded too.

## Aspect ratios worth shooting or cropping for

| Use | Ratio |
| --- | --- |
| Desktop hero, full-bleed | 16:9 or wider |
| Mobile hero | 4:5 or 9:16, cropped separately, never a squeezed desktop crop |
| Project cover card | 4:5 portrait |
| Gallery, mixed | 3:2 landscape and 4:5 portrait, alternating |
| Detail and macro shots | 1:1 |

A separate mobile hero crop is required, not optional. A 21:9 cinematic frame squeezed
into a 390px screen loses the composition entirely.

## Every image needs alt text

Alt text is entered in the content frontmatter alongside the image path. It is required
for accessibility and it is read by search engines. Describe the space, not the file.

Good: `Living room with travertine wall and blackened steel joinery`
Bad: `image1`, `interior`, `project photo`

## Licensing

Real project photography with cleared usage rights, or licensed stock. Images of other
studios work do not ship. A prospect who reverse-searches one photograph and finds it
belongs to another firm discards the entire brand.
