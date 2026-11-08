// The book cover that swings open onto the home page.
import { h } from './core/dom.js';
import { berrySvg } from './mascot.js';

const SWING_MS = 950;

let current = null;

function removeCover() {
  if (!current) return;
  clearTimeout(current.timer);
  current.wrap.remove();
  current.root.inert = false;
  current = null;
}

export function openCover() {
  if (!current || current.opening) return;
  current.opening = true;
  current.root.inert = false;
  current.cover.classList.add('is-open');
  current.onOpen?.();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  current.timer = setTimeout(removeCover, reduced ? 0 : SWING_MS);
}

// Takes the cover away with no animation, for example when leaving for a game.
export function dismissCover() {
  removeCover();
}

// With swingShut, the cover starts open and closes while she watches.
export function showCover({ root, onOpen, swingShut = false }) {
  if (current) return;
  const open = h('button', { class: 'cover-open', type: 'button' }, 'Open the book');
  const cover = h('div', { class: `cover${swingShut ? ' is-ajar' : ''}`, onClick: openCover },
    h('div', { class: 'cover-plate' },
      h('div', { class: 'cover-berry', html: berrySvg }),
      h('h2', null, 'Brain Snacks'),
      h('p', null, 'Short puzzles, with hints and answers whenever you want them.'),
      open,
    ),
  );
  const wrap = h('div', { class: 'cover-wrap' }, cover);
  document.body.append(wrap);
  root.inert = true;
  current = { wrap, cover, root, onOpen, opening: false, timer: null };
  if (swingShut) {
    cover.getBoundingClientRect();
    cover.classList.remove('is-ajar');
  }
  open.focus({ preventScroll: true });
}
