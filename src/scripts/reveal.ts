/**
 * Reveal on scroll.
 *
 * IntersectionObserver plus a CSS class. No animation library, because the
 * vocabulary here is a fade, a short rise and an image wipe, which CSS does
 * at effectively zero cost. GSAP stays reserved for anything genuinely
 * beyond that.
 *
 * The initial hidden state lives behind `.js` in global.css, so a visitor
 * with JavaScript disabled sees a fully rendered page rather than a blank one.
 */

const REVEALED = 'is-revealed';
const SELECTOR = '[data-reveal]';

/** Stagger step between siblings inside a `data-reveal-group`. */
const STAGGER_MS = 90;
/** Beyond this the last item in a group feels detached from the first. */
const MAX_STAGGER_MS = 450;

function revealAll(): void {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    el.classList.add(REVEALED);
  });
}

/**
 * Assigns delays from the markup so sections do not have to hand-number every
 * child. A parent carrying `data-reveal-group` staggers its reveal descendants
 * in document order; an explicit `data-reveal-delay` always wins.
 */
function applyGroupDelays(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || STAGGER_MS;
    const items = group.querySelectorAll<HTMLElement>(SELECTOR);

    items.forEach((item, index) => {
      if (item.dataset.revealDelay) return;
      item.dataset.revealDelay = String(Math.min(index * step, MAX_STAGGER_MS));
    });
  });
}

export function initReveal(): void {
  document.documentElement.classList.add('js');

  applyGroupDelays();

  const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  if (elements.length === 0) return;

  // Reduced motion, or a browser without IntersectionObserver: show everything.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const reveal = (el: HTMLElement) => {
    const delay = el.dataset.revealDelay;
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.classList.add(REVEALED);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    {
      // Fire slightly before the element reaches the fold so the motion is
      // already settling by the time it is properly in view.
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
    },
  );

  for (const el of elements) {
    // Anything already on the first screen reveals immediately without a
    // transition, so the page does not animate itself in after load.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.classList.add(REVEALED);
      continue;
    }
    observer.observe(el);
  }
}
