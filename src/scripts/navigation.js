/**
 * Comportamento do menu (src/components/NavigationBar.astro): submenus de
 * desktop e mobile, e o menu mobile como diálogo com o foco preso lá dentro.
 */
export function initNavigation(root = document) {
  const nav = root.querySelector('[data-nav]');
  const desktopMenu = nav.querySelector('[data-desktop-menu]');
  const mobileToggle = nav.querySelector('[data-mobile-toggle]');
  const overlay = nav.querySelector('[data-mobile-overlay]');
  const mobileMenu = overlay.querySelector('#mobile-menu');
  const toggles = [...nav.querySelectorAll('[data-dropdown-toggle]')];

  // Submenus: só um aberto de cada vez (como antes, no menu de desktop e no
  // menu mobile).
  const submenuOf = (toggle) => nav.querySelector(`#${toggle.getAttribute('aria-controls')}`);
  const openToggle = () => toggles.find((t) => t.getAttribute('aria-expanded') === 'true');

  function setOpen(toggle, open) {
    toggle.setAttribute('aria-expanded', String(open));
    submenuOf(toggle).hidden = !open;
    toggle.querySelector('.mobile-dropdown-arrow')?.classList.toggle('active', open);
  }

  function closeDropdowns() {
    toggles.forEach((toggle) => setOpen(toggle, false));
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
      closeDropdowns();
      setOpen(toggle, !wasOpen);
    });
  });

  // Menu de desktop: fecha o submenu aberto ao clicar fora ou com Escape.
  document.addEventListener('mousedown', (e) => {
    if (overlay.hidden && !desktopMenu.contains(e.target)) closeDropdowns();
  });

  // Menu mobile: diálogo com o foco preso lá dentro enquanto está aberto.
  let previouslyFocused = null;

  const focusables = () =>
    [...mobileMenu.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
      .filter((el) => !el.disabled && el.offsetParent !== null);

  function setMobileOpen(open) {
    closeDropdowns();
    overlay.hidden = !open;
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute(
      'aria-label',
      open ? mobileToggle.dataset.labelClose : mobileToggle.dataset.labelOpen
    );
    mobileToggle.querySelector('[data-icon="open"]').toggleAttribute('hidden', open);
    mobileToggle.querySelector('[data-icon="close"]').toggleAttribute('hidden', !open);

    if (open) {
      previouslyFocused = document.activeElement;
      focusables()[0]?.focus();
    } else if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus();
    }
  }

  mobileToggle.addEventListener('click', () => setMobileOpen(overlay.hidden));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) setMobileOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.hidden) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    if (e.key === 'Escape') {
      const toggle = openToggle();
      if (!toggle) return;
      closeDropdowns();
      toggle.focus();
    }
  });
}
