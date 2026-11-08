import { h } from './dom.js';
import { load, save } from './storage.js';

const KEY = 'bs.theme';
const FADE_MS = 500;
const SUN = '<svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></svg>';
const MOON = '<svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';

const page = document.documentElement;
const isDark = () => page.dataset.theme === 'dark';
let fadeTimer = null;

function applyTheme(theme) {
  page.dataset.theme = theme;
  page.classList.add('theme-changing');
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => page.classList.remove('theme-changing'), FADE_MS);
  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
}

// Follows the computer's light or dark setting until she has chosen for herself.
export function followSystemTheme() {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (load(KEY) === null) applyTheme(event.matches ? 'dark' : 'light');
  });
}

// The saved choice is applied by a small script in index.html, before the first paint.
export function themeToggle() {
  return h('button', {
    class: 'theme-toggle',
    type: 'button',
    'aria-label': 'Dark mode',
    'aria-pressed': String(isDark()),
    onClick: () => {
      const theme = isDark() ? 'light' : 'dark';
      applyTheme(theme);
      save(KEY, theme);
    },
  }, h('span', { class: 'theme-knob', html: SUN + MOON }));
}
