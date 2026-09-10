/**
 * Reveal on scroll.
 *
 * IntersectionObserver plus a CSS class. No animation library, because the
 * vocabulary here is a fade and a short upward move, which CSS does at
 * effectively zero cost. GSAP is reserved for the hero and the lightbox.
 *
 * The initial hidden state lives behind `.js` in global.css, so a visitor
 * with JavaScript disabled sees a fully rendered page rather than a blank one.
 */

const REVEALED = 'is-revealed';
const SELECTOR = '[data-reveal]';

function revealAll(): void {
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    el.classList.add(REVEALED);
  });
}

export function initReveal(): void {
  document.documentElement.classList.add('js');

  const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
  if (elements.length === 0) return;

  // Reduced motion, or a browser without IntersectionObserver: show everything.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;

        // Stagger is expressed in the markup as data-reveal-delay="120".
        const delay = el.dataset.revealDelay;
        if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);

        el.classList.add(REVEALED);
        observer.unobserve(el);
      }
    },
    {
      // Fire slightly before the element reaches the fold so the motion is
      // already settling by the time it is properly in view.
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.08,
    },
  );

  for (const el of elements) {
    // Anything already in the viewport on load reveals immediately, so the
    // first screen is never animated in after the fact.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add(REVEALED);
      continue;
    }
    observer.observe(el);
  }
}
