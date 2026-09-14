/**
 * Reveal on scroll.
 *
 * IntersectionObserver plus a CSS class. No animation library, because the
 * vocabulary here is a fade, a short rise and an image wipe, which CSS does
 * at effectively zero cost.
 *
 * ── Design rule ──────────────────────────────────────────────────────────
 * Content is hidden by CSS and shown by script, and `clip-path` keeps an
 * element's layout box while painting nothing. So a reveal that fails to fire
 * does not degrade gracefully: it leaves a silent, correctly-sized hole in
 * the page. Anything that hides content therefore needs a guaranteed way back.
 *
 * This module has three, in order of preference:
 *
 *   1. the observer, which handles the normal case
 *   2. a scroll and resize sweep, which catches anything the observer missed
 *      because it was mis-measured while fonts and images were still settling
 *   3. a failsafe timer, which settles everything already on or above the
 *      fold once layout has had time to settle
 *
 * Between them, the worst case is an element that appears without its
 * animation, never an element that never appears. The failsafe deliberately
 * leaves anything below the fold to the sweep, so it still animates when the
 * visitor scrolls to it.
 */

const REVEALED = 'is-revealed';
const SELECTOR = '[data-reveal]';

/** Stagger step between siblings inside a `data-reveal-group`. */
const STAGGER_MS = 90;
/** Beyond this the last item in a group feels detached from the first. */
const MAX_STAGGER_MS = 450;
/** Nothing stays hidden longer than this, whatever else has gone wrong. */
const FAILSAFE_MS = 2500;

function reveal(el: HTMLElement): void {
  if (el.classList.contains(REVEALED)) return;
  const delay = el.dataset.revealDelay;
  if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
  el.classList.add(REVEALED);
}

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
    group.querySelectorAll<HTMLElement>(SELECTOR).forEach((item, index) => {
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

  const pending = new Set(elements);

  const settle = (el: HTMLElement) => {
    reveal(el);
    pending.delete(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        settle(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    {
      // Threshold 0 on purpose. A percentage threshold is measured against the
      // target's own size, so a section taller than the viewport can need an
      // awkward amount of itself on screen before it counts as intersecting.
      // Any pixel of overlap is the honest trigger here.
      threshold: 0,
      rootMargin: '0px 0px -6% 0px',
    },
  );

  /** Sweep: reveal anything whose top has already reached the fold. */
  const sweep = () => {
    if (pending.size === 0) return;
    const fold = window.innerHeight * 0.94;
    for (const el of Array.from(pending)) {
      if (el.getBoundingClientRect().top < fold) {
        settle(el);
        observer.unobserve(el);
      }
    }
  };

  for (const el of elements) {
    // Anything already on the first screen reveals immediately without a
    // transition, so the page does not animate itself in after load.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.94) {
      el.classList.add(REVEALED);
      pending.delete(el);
      continue;
    }
    observer.observe(el);
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      sweep();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Fonts and images change layout after first paint, so measure again once
  // everything has loaded rather than trusting the initial pass.
  window.addEventListener('load', sweep, { once: true });

  // The failsafe only settles what the visitor could already be looking at,
  // never the whole page. Revealing everything here used to empty the queue
  // before anyone scrolled, so on a long phone layout every section below the
  // first screen arrived already visible and none of them animated. Anything
  // further down is still guaranteed: the scroll sweep reveals it on arrival.
  window.setTimeout(sweep, FAILSAFE_MS);
}
