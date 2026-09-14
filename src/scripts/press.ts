/**
 * Touch press state.
 *
 * Tailwind wraps every `hover:` utility in `@media (hover: hover)`, so on a
 * phone none of the site's hover effects ever run and every page reads as
 * static. global.css extends the hover variant to also match `[data-pressed]`,
 * and this module sets that attribute while a finger is on something the
 * visitor can act on.
 *
 * Touch only. A mouse or pen keeps real :hover, so desktop is unchanged.
 *
 * A press is confirmed after a short delay rather than on pointerdown, because
 * most touches on a phone are the start of a scroll. The browser fires
 * pointercancel as soon as a pan begins, which drops the pending press before
 * anything lights up. A tap too quick to reach the delay is still shown,
 * briefly, after the finger lifts.
 */

const ATTR = 'data-pressed';
/** Long enough for a scroll to cancel the press, short enough to feel instant. */
const PRESS_DELAY_MS = 70;
/** A tap shorter than this is held on screen until it has been seen. */
const MIN_VISIBLE_MS = 240;
const INTERACTIVE = 'a[href], button, label, summary, [role="button"], [data-press]';

/**
 * The pressed element, plus every `.group` around the touch point, because
 * `group-hover:` effects (a card's image zoom, an arrow's nudge) are keyed to
 * the group rather than to the link inside it.
 */
function targetsFor(start: Element): HTMLElement[] {
  const targets = new Set<HTMLElement>();
  const interactive = start.closest<HTMLElement>(INTERACTIVE);
  if (interactive) targets.add(interactive);

  let group = start.closest<HTMLElement>('.group');
  while (group) {
    targets.add(group);
    group = group.parentElement?.closest<HTMLElement>('.group') ?? null;
  }
  return Array.from(targets);
}

export function initPress(): void {
  let active: HTMLElement[] = [];
  let pressTimer = 0;
  let releaseTimer = 0;
  let pressedAt = 0;

  const apply = () => {
    for (const el of active) el.setAttribute(ATTR, '');
    pressedAt = performance.now();
  };

  const clear = () => {
    window.clearTimeout(pressTimer);
    window.clearTimeout(releaseTimer);
    for (const el of active) el.removeAttribute(ATTR);
    active = [];
    pressedAt = 0;
  };

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.pointerType !== 'touch' || !event.isPrimary) return;
      clear();
      if (!(event.target instanceof Element)) return;
      active = targetsFor(event.target);
      if (active.length === 0) return;
      pressTimer = window.setTimeout(apply, PRESS_DELAY_MS);
    },
    { passive: true },
  );

  document.addEventListener(
    'pointerup',
    (event) => {
      if (event.pointerType !== 'touch' || active.length === 0) return;
      window.clearTimeout(pressTimer);
      if (!pressedAt) apply();
      const shown = performance.now() - pressedAt;
      releaseTimer = window.setTimeout(clear, Math.max(0, MIN_VISIBLE_MS - shown));
    },
    { passive: true },
  );

  // A scroll, a system gesture or a second finger. Nothing should stay lit.
  document.addEventListener('pointercancel', clear, { passive: true });

  // Coming back through the back/forward cache must not restore a lit card.
  window.addEventListener('pageshow', clear);
}
