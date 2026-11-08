import { h } from './dom.js';
import { save } from './storage.js';

const SUN = '<svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';
const MOON = '<svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';

const isDark = () => document.documentElement.dataset.theme === 'dark';

// The saved choice is applied by a small script in index.html, before the first paint.
export function themeToggle() {
  const button = h('button', {
    class: 'theme-toggle',
    type: 'button',
    'aria-label': 'Dark mode',
    'aria-pressed': String(isDark()),
    onClick: () => {
      const theme = isDark() ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      save('bs.theme', theme);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
    },
  }, h('span', { class: 'theme-knob', html: SUN + MOON }));
  return button;
}
