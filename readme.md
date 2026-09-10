# Zen Interior — Digital Platform

A static-first luxury brand experience for **Zen Interior**, a premium interior design,
global sourcing and turnkey execution company operating across **Tamil Nadu & Bangalore**.

This is not "a five page website". It is version one of a platform whose current
implementation happens to be static. Every internal boundary is drawn so that local
content can become a CMS, and a WhatsApp deep link can become a CRM pipeline, without
rewriting the frontend.

---

## 1. The one job

A visitor considering an investment between forty lakh and fifty crore is not asking
"can they build this". They are asking "do these people operate at my level".

The first ten seconds must say: this is not a normal interior contractor.
Everything below is subordinate to that.

**Design hierarchy, in strict order of importance:**

```
PHOTOGRAPHY  >  TYPOGRAPHY  >  WHITESPACE  >  MATERIAL  >  ANIMATION  >  INTERACTION
```

Invisible technology. Visible craftsmanship.

---

## 2. Brand rules

**Positioning.** Zen Interior combines international product sourcing with local design
expertise and professional execution to create distinctive, premium spaces.

**Never write:** affordable, cheap, low cost, best price, package, quotation,
"we import from China", "our workers", "contact our sales team".

**Write instead:** globally sourced materials, architectural products, our execution team,
begin a private consultation, considered, bespoke, turnkey.

**Never fabricate** awards, certifications, client names, testimonials or project counters.
A prospect who verifies one false claim discards the whole brand.

**Services are stated broadly.** Residential Interiors, Bespoke Furniture, Architectural
Interiors, Material Sourcing, Commercial Spaces, Turnkey Execution. Never "modular kitchen",
"false ceiling", "TV unit". Those are commodity words.

---

## 3. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Astro 5 + TypeScript | Ships HTML, not a bundle. Content-first. Real URLs. |
| Styling | Tailwind CSS v4 + CSS design tokens | v4 is CSS-first, so tokens live in CSS and Tailwind consumes them. |
| Interactivity | Vanilla TypeScript in Astro script blocks | Menu, lightbox, filter and form need no framework. |
| Animation | CSS transitions + IntersectionObserver, GSAP only where earned | See the motion budget in section 8. |
| Content | Astro Content Collections with Zod schemas | The schema is the seam a CMS plugs into. |
| Images | Astro Image, AVIF and WebP, responsive srcset | Largest performance risk on a photography-led site. |
| Fonts | Self-hosted variable fonts via Fontsource | No third-party request, no layout shift. |
| Enquiry | Netlify Forms capture plus WhatsApp deep link | Lead is never lost if the visitor does not press send. |
| Hosting | Netlify, static output, no adapter | Auto-detects Astro. Deploy previews for client review. |
| SEO | Per-page metadata, sitemap, canonical, Open Graph, JSON-LD | Built in from day one, not bolted on. |

**Deliberately excluded from v1:** React or Preact islands, Lenis smooth scroll, a CMS,
any backend, Playwright, analytics, chat widgets, map embeds, social embeds.
Each is a phase-two decision with a trigger recorded in section 13.

---

## 4. Directory architecture

```
zen-interior/
├── public/
│   ├── images/            static, non-optimized assets only
│   ├── fonts/             reserved
│   ├── brand/             logo variants: full, reversed, mark-only
│   └── robots.txt
├── src/
│   ├── config/
│   │   └── site.ts        single source of truth: company, contact, WhatsApp, URLs
│   ├── data/
│   │   ├── navigation.ts  header, footer, legal links
│   │   ├── services.ts    the six broad capability statements
│   │   ├── enquiry.ts     project types, investment bands, service regions
│   │   └── methodology.ts the five-stage Zen method
│   ├── content/
│   │   ├── projects/      one markdown file per project
│   │   └── journal/       one markdown file per article
│   ├── content.config.ts  Zod schemas. The CMS contract.
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── layout/        Header, Footer, MobileMenu, SkipLink
│   │   ├── seo/           SEO, JsonLd
│   │   ├── ui/            Container, Button, Eyebrow, SectionHeading, Reveal, Figure
│   │   ├── home/          hero and homepage sections
│   │   ├── projects/      ProjectCard, ProjectGrid, ProjectGallery, Lightbox, ProjectMeta
│   │   ├── journal/       ArticleCard, ArticleHero, ArticleBody
│   │   └── forms/         EnquiryForm
│   ├── lib/
│   │   ├── whatsapp.ts    Enquiry to encoded wa.me URL
│   │   ├── enquiry.ts     Enquiry type and validation, shared by form and lib
│   │   ├── seo.ts         metadata and JSON-LD builders
│   │   └── format.ts      dates, counters, slugs
│   ├── scripts/
│   │   ├── reveal.ts      IntersectionObserver reveal, reduced-motion aware
│   │   └── header.ts      transparent to solid on scroll
│   ├── styles/
│   │   ├── tokens.css     colour, spacing, type, motion, z-index
│   │   ├── typography.css the editorial type scale
│   │   └── global.css     reset, base elements, utilities
│   └── pages/
│       ├── index.astro
│       ├── projects/index.astro
│       ├── projects/[slug].astro
│       ├── journal/index.astro
│       ├── journal/[slug].astro
│       ├── about.astro
│       ├── contact.astro
│       └── 404.astro
├── astro.config.mjs
├── netlify.toml
├── tsconfig.json
└── readme.md
```

**Rule.** Pages are compositions. A page file that contains raw markup instead of
composed components is a defect. Content never gets hardcoded into a component.

---

## 5. Content model

The schema is the most important file in the repository. It is the interface that a CMS
will later implement.

**Project**

```
slug          derived from filename
title         The Quiet Villa
location      Coimbatore
region        Tamil Nadu | Bangalore
category      Private Residence | Luxury Villa | Apartment | Commercial | Hospitality | Office
year          number
cover         image
gallery       image[] with alt and optional caption
summary       one editorial sentence, used on cards and Open Graph
concept       the design story
materials     string[] of material statements
execution     what Zen actually delivered
highlights    string[] of three to five
scope         string
featured      boolean, controls homepage placement
order         number, manual sequencing
draft         boolean, excluded from build when true
```

**Journal article**

```
slug             derived from filename
title            The Art of Quiet Luxury
category         Materials | Design | Craft | Sourcing | Living
excerpt          roughly six lines, written to create curiosity, not to summarise
cover            image
publishedAt      date
readingTime      derived
author           string
relatedProjects  project slug[]
featured         boolean
draft            boolean
```

Routes are real and readable.

```
/projects
/projects/the-quiet-villa
/journal
/journal/the-art-of-quiet-luxury
```

Never `/project?id=3`.

---

## 6. Design system

### Palette

The logo anchors the brand at deep teal. The site is not dark teal. Dark teal everywhere
reads heavy, not expensive.

| Token | Hex | Role |
| --- | --- | --- |
| `--zen-teal` | `#01342F` | Brand anchor, dark sections, headings on ivory |
| `--zen-teal-deep` | `#002B27` | Depth, hover states |
| `--zen-ivory` | `#F5F1E8` | Primary page ground |
| `--zen-stone` | `#E4DDD0` | Section alternation, cards |
| `--zen-beige` | `#D5CABB` | Rules, borders, muted fills |
| `--zen-charcoal` | `#171816` | Body copy on light |
| `--zen-black` | `#0B0D0C` | Full-bleed image sections |
| `--zen-brass` | `#A58A5B` | Accent only. Never a fill, never a gradient. |

**Distribution target, approximate:** sixty percent ivory and stone, twenty-five percent
teal, ten percent charcoal and black, five percent brass.

White is used sparingly. The logo sits on warm ivory, not pure white, which is what makes
the brand read warm rather than clinical.

### Typography

Two families. Not three, not five.

- **Display:** Cormorant Garamond Variable. Headlines, project titles, pull quotes.
- **Sans:** Manrope Variable. Navigation, buttons, metadata, body, forms.

Editorial scale, fluid via `clamp()`. Display sizes carry tight leading and slightly
negative tracking. Small sans labels carry wide positive tracking and uppercase.

### Geometry

Radius stays between zero and four pixels. Architectural, not rounded. Rounded cards
everywhere is the single fastest way to look like a template.

### Container

Content maxes at 1600px with generous gutters. Imagery is permitted to break the container
deliberately. Content never stretches edge to edge on a 4K display.

### Breakpoints

Designed at 360, 390, 430, 768, 1024, 1280, 1440, 1600 and above.
The 1440 to 1600 range matters most for this audience.

Mobile is a separate design, not a compressed desktop. Hero imagery gets its own crop.

---

## 7. Enquiry architecture

The contact page is a qualification mechanism, not a contact form. It reads as a private
project enquiry, and the investment bands themselves communicate the level Zen operates at.

**Fields.** Full name, phone, email, location, project type, estimated project investment,
requirements.

**Investment bands.** Forty lakh to seventy-five lakh, through to twenty-five crore and
above, plus "prefer to discuss privately".

**Flow.**

```
Visitor completes form
        │
        ▼
Client-side validation
        │
        ├──────────────► Netlify Forms  (lead captured server-side, always)
        │
        ▼
Build structured message  ──►  URL encode  ──►  wa.me deep link
        │
        ▼
WhatsApp opens with message pre-filled, visitor presses Send
```

**Two rules that are easy to get wrong.**

1. The site never sends a WhatsApp message. It pre-fills one. The visitor sends it.
2. `window.open` must run synchronously inside the click handler. Validate first, then
   open. An awaited call before `window.open` is silently blocked by Safari and Chrome.

The WhatsApp number lives in `src/config/site.ts` as a single value. It is never repeated
inside a component.

The `Enquiry` object is shaped now for the pipeline it will feed later.

```
Enquiry { name, phone, email, location, projectType, investment, requirements, source, createdAt }
```

Today it goes to WhatsApp and Netlify Forms. Later the same object posts to an API that
fans out to CRM, email and analytics. The form component does not change.

---

## 8. Motion budget

Roughly sixty percent static, thirty percent subtle movement, ten percent dramatic.
The hero gets the strongest motion. Everything else breathes.

**Permitted.** Hero image slow scale, staggered headline reveal, upward text on scroll,
image clip reveal, subtle zoom on project hover, cross-page fade.

**Forbidden.** Flying text, 3D rotating cards, custom cursor effects, constant parallax,
glowing buttons, particles, marquees that never stop.

**`prefers-reduced-motion: reduce` is honoured everywhere.** Reveals become instant,
autoplay video is replaced by its poster, scale and parallax are disabled. This is checked
before any animation ships, not after.

GSAP is loaded only on routes that use it, and only for the hero and the lightbox.
Everything else is IntersectionObserver plus CSS transitions.

---

## 9. Performance budget

Treated as a design constraint, not a final optimization task.

| Metric | Budget |
| --- | --- |
| JavaScript on the homepage | under 30KB gzipped |
| Largest Contentful Paint, mobile 4G | under 2.0s |
| Cumulative Layout Shift | under 0.02 |
| Total homepage transfer | under 1.2MB |
| Font families | 2, variable, latin subset |
| Third-party scripts in v1 | zero |

Only the true hero asset is preloaded. Everything below the fold lazy loads.
Every image declares width and height. Gallery images get their own responsive sizes,
and thumbnails are a separate smaller derivative, never a scaled-down full image.

---

## 10. SEO

Every page carries title, meta description, canonical URL, Open Graph and Twitter card.
Open Graph matters disproportionately here, because these links get shared on WhatsApp.
A shared project link must preview as the project photograph and its title, never as
"Home | Zen Interior".

JSON-LD: Organization on every page, Article on journal entries, BreadcrumbList on
project and journal detail pages, LocalBusiness once real business details are confirmed.

Pages communicate their subject naturally. No keyword stuffing, and no
"best interior designers in Chennai" in visible copy.

---

## 11. Accessibility

Semantic HTML, correct heading order, keyboard operable throughout, visible focus rings,
alt text on every image, sufficient contrast, labelled form fields with inline errors,
Escape closes the lightbox and the mobile menu, focus is trapped while they are open and
restored on close, and nothing is reachable by hover alone.

---

## 12. Roadmap

### Phase 0 — Foundation `complete`

- [x] Repository, Astro 5, TypeScript, Tailwind v4, tooling
- [x] Design tokens, type scale, global styles
- [x] BaseLayout, SEO component, JSON-LD builder
- [x] Header with scroll state, Footer, mobile menu with focus trap
- [x] Content collections, Zod schemas, seed entries
- [x] All routes resolving, including dynamic project and journal pages
- [x] Enquiry model, WhatsApp library, site config
- [x] Reveal system with reduced-motion support
- [x] netlify.toml, robots, sitemap, 404
- [x] Clean production build, twelve pages, zero type errors

Carried forward as known gaps:

- Logo renders a typographic stand-in. Activate the real artwork in
  `src/components/layout/Logo.astro` once the SVG files are in `public/brand/`.
- `src/config/site.ts` holds placeholder contact details and a placeholder
  WhatsApp number. Nothing reaches a real inbox until these are set.
- Three polymorphic components fall back to loose prop typing, so a prop typo
  on `Container`, `Reveal` or `SectionHeading` is not caught at build time.

#### Photography status

Fourteen supplied images are wired in, grouped so each project reads as one
house rather than a stock gallery.

| Project | Family | Frames |
| --- | --- | --- |
| The Quiet Villa | Dark marble and bronze, double height | 3 |
| The Emerald Residence | Warm timber, built-in joinery | 7 |
| The Slate Apartment | Grey lacquer, walnut, stone | 4 |

Three constraints to resolve before the client demo.

- **Resolution.** The originals top out at 1600px on the long edge. Full-bleed
  heroes want 2400px or more, so the hero currently upscales slightly on a
  large display.
- **Reuse.** Fourteen photographs across three projects, a homepage, an about
  page and three journal covers means several images appear twice. No page
  repeats an image within itself, but the site will read thin until there is
  more work to show.
- **Provenance.** These read as renders rather than photographs of built work.
  That is fine for a layout demo. Before launch they must be replaced with
  Zen Interior's own completed projects, or the site claims work it cannot
  substantiate.

`tools/import-images.mjs` holds the source-to-destination map. Re-run it after
dropping replacements into the source folder.

### Phase 1 — Homepage to ninety percent

The most impressive page is built first. Five mediocre pages is a failure state.

```
01 Hero                     full viewport, cinematic
02 Brand statement          one line, one paragraph
03 Signature project        editorial, asymmetric, not a grid
04 Secondary projects       offset composition
05 Global sourcing          access and expertise, never import-export
06 Material story           marble, wood, metal, fabric, light, stone
07 The Zen method           discover, design, source, craft, deliver
08 Featured journal
09 Service geography        Tamil Nadu, Bangalore
10 Private enquiry CTA
```

Note what is absent: there is no "Our Services" grid and no testimonial carousel.

### Phase 2 — Projects

Index with category filter, detail template, asymmetric gallery, immersive lightbox with
keyboard support, closing CTA. The project detail page is the strongest sales asset on the
site and gets proportional effort.

### Phase 3 — Journal

Index with editorial cards carrying the six-line curiosity excerpt, article template with
generous measure, inline imagery, related projects.

### Phase 4 — About

Opens with philosophy, not incorporation history. Establishes philosophy, design expertise,
global sourcing, execution, quality control, geography, client experience.

### Phase 5 — Contact

Premium enquiry experience, Netlify Forms capture, WhatsApp deep link, full validation,
success state.

### Phase 6 — Photography

The highest-risk item in the project. Real project photography replaces every placeholder.
Licensing is settled before launch. Scraped imagery of other studios work does not ship.

### Phase 7 — Hardening

Image derivatives, font subsetting, JS audit against budget, Lighthouse, Open Graph
verification, accessibility audit, 404 and deep-link checks.

### Phase 8 — Deploy and demo

GitHub to Netlify preview, desktop and mobile QA across the breakpoint matrix, client demo,
then production and custom domain.

---

## 13. Deferred decisions and their triggers

| Deferred | Add it when |
| --- | --- |
| CMS such as Sanity or Payload | The client team needs to publish without a developer |
| Backend API | Enquiries must reach a CRM, or content must be dynamic |
| Playwright | There is a flow worth protecting from regression |
| Analytics | The site is live and the funnel needs measuring |
| Lenis smooth scroll | Testing proves it improves the experience, not before |
| Netlify Image CDN adapter | Local optimization stops being sufficient |
| GSAP beyond hero and lightbox | A specific sequence genuinely cannot be done in CSS |

Because content already flows through a typed schema into components, none of these
require touching the presentation layer.

---

## 14. Deployment

```
GitHub  ──►  Netlify  ──►  astro build  ──►  dist/  ──►  CDN
```

Build command `npm run build`, publish directory `dist`, no adapter needed for static
output. Feature branches produce preview URLs for client approval before merge.

---

## 15. Local development

```
npm install       install dependencies
npm run dev       development server at localhost:4321
npm run build     production build to dist/
npm run preview   serve the production build locally
npm run check     Astro and TypeScript diagnostics
```

---

## 16. Required configuration

These must be supplied before the site is client-ready. Placeholders are marked in
`src/config/site.ts`.

- WhatsApp business number in international format
- Business phone and email
- Registered business address, if a LocalBusiness schema is wanted
- Final domain
- Logo files: full colour, reversed for dark grounds, mark only for compact contexts
- Real project photography with cleared usage rights
