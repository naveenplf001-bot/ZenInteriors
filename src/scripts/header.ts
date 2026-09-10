/**
 * Header behaviour.
 *
 * Two responsibilities: the transparent-to-solid transition as the hero
 * scrolls away, and the mobile menu including its focus trap.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function initScrollState(header: HTMLElement): void {
  // The header sits over the hero on pages that have one. It becomes solid
  // once the viewport has moved past roughly the first fold of imagery.
  const threshold = () => Math.min(window.innerHeight * 0.6, 480);
  let ticking = false;

  const update = () => {
    const scrolled = window.scrollY > threshold();
    header.dataset.scrolled = scrolled ? 'true' : 'false';
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

function initMobileMenu(header: HTMLElement): void {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const closeButton = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!toggle || !menu) return;

  let lastFocused: HTMLElement | null = null;

  const focusableInMenu = () =>
    Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    // Focus trap. Tab cycles within the menu while it is open.
    const items = focusableInMenu();
    if (items.length === 0) return;
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function open(): void {
    lastFocused = document.activeElement as HTMLElement | null;
    menu!.dataset.open = 'true';
    menu!.removeAttribute('inert');
    toggle!.setAttribute('aria-expanded', 'true');
    document.body.dataset.scrollLocked = 'true';
    document.addEventListener('keydown', onKeydown);
    // Focus the close control first, so the trap has a known starting point.
    window.requestAnimationFrame(() => (closeButton ?? focusableInMenu()[0])?.focus());
  }

  function close(): void {
    menu!.dataset.open = 'false';
    menu!.setAttribute('inert', '');
    toggle!.setAttribute('aria-expanded', 'false');
    delete document.body.dataset.scrollLocked;
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.dataset.open === 'true';
    isOpen ? close() : open();
  });

  closeButton?.addEventListener('click', close);

  // Navigating to a same-page target should not leave the menu covering it.
  menu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', close);
  });

  // Returning to desktop width while open would otherwise strand the overlay.
  window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
    if (event.matches && menu.dataset.open === 'true') close();
  });
}

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  initScrollState(header);
  initMobileMenu(header);
}
