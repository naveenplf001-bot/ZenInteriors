/**
 * Count-up for figures.
 *
 * Mark a figure with `data-count="06"`, where the attribute matches the text it
 * already renders. The HTML always carries the final figure, so without
 * JavaScript, with reduced motion, or for a figure already on screen at load,
 * nothing moves and nothing is ever wrong.
 *
 * A figure further down the page is set to zero while it is still out of
 * sight and counts up once it scrolls into view. Leading zeros are kept, so
 * "06" runs 00, 01 … 06 and the figure's width never jumps.
 */

const DURATION_MS = 1100;

function countUp(el: HTMLElement, target: number, width: number): void {
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min((now - start) / DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased)).padStart(width, '0');
    if (progress < 1) window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

export function initCountUp(): void {
  const figures = Array.from(document.querySelectorAll<HTMLElement>('[data-count]')).filter(
    (el) => /^\d+$/.test(el.dataset.count ?? ''),
  );
  if (figures.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        const raw = el.dataset.count!;
        countUp(el, Number(raw), raw.length);
      }
    },
    // Slightly inside the fold, so the count starts once the figure is
    // properly on screen rather than at its first visible pixel.
    { threshold: 0, rootMargin: '0px 0px -12% 0px' },
  );

  for (const el of figures) {
    // Already visible at load: leave it alone rather than animate on arrival.
    if (el.getBoundingClientRect().top < window.innerHeight) continue;
    el.textContent = '0'.padStart(el.dataset.count!.length, '0');
    observer.observe(el);
  }
}
