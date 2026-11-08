import { h } from './dom.js';
import { save } from './storage.js';

const KEY = 'bs.font';
const MENU_REM = 15;
const EDGE_PX = 12;

export const DEFAULT_FONT = 'cosy';
export const FONTS = [
  { id: 'cosy', name: 'Cosy', about: "Berry's notes in handwriting." },
  { id: 'clear', name: 'Clear', about: 'Plain letters for everything but the titles.' },
  { id: 'roomy', name: 'Roomy', about: 'Plain letters that are wider and more open.' },
];

const page = () => document.documentElement;
const currentFont = () => page().dataset.font ?? DEFAULT_FONT;
let menuCount = 0;

function applyFont(id) {
  if (id === DEFAULT_FONT) delete page().dataset.font;
  else page().dataset.font = id;
}

function placeMenu(menu, button) {
  const rect = button.getBoundingClientRect();
  const width = page().clientWidth;
  const menuWidth = MENU_REM * parseFloat(getComputedStyle(page()).fontSize);
  const furthest = width - menuWidth - EDGE_PX;
  menu.style.top = `${rect.bottom + 8}px`;
  menu.style.right = `${Math.max(EDGE_PX, Math.min(width - rect.right, furthest))}px`;
}

// The saved choice is applied by a small script in index.html, before the first paint.
export function fontPicker() {
  const id = `font-menu-${++menuCount}`;
  const options = FONTS.map((font) =>
    h('button', {
      class: `font-option font-option-${font.id}`,
      type: 'button',
      'aria-pressed': String(font.id === currentFont()),
      onClick: () => {
        applyFont(font.id);
        save(KEY, font.id);
        options.forEach((option, index) => {
          option.setAttribute('aria-pressed', String(FONTS[index].id === font.id));
        });
      },
    },
      h('span', { class: 'font-name' }, font.name),
      h('span', { class: 'font-about' }, font.about),
    ),
  );
  const button = h('button', {
    class: 'font-button',
    type: 'button',
    popovertarget: id,
    'aria-label': 'Choose a font',
    title: 'Choose a font',
  }, 'Aa');
  const menu = h('div', {
    class: 'font-menu',
    id,
    popover: 'auto',
    role: 'group',
    'aria-label': 'Font',
    onBeforetoggle: (event) => {
      if (event.newState === 'open') placeMenu(menu, button);
    },
    onToggle: (event) => {
      if (event.newState === 'open') options[FONTS.findIndex((font) => font.id === currentFont())].focus();
    },
    // Keys pressed in the menu shouldn't also play the puzzle or turn the page.
    onKeydown: (event) => event.stopPropagation(),
  }, options);
  return h('div', { class: 'font-picker' }, button, menu);
}
