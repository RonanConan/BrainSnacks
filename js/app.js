import { h } from './core/dom.js';
import { load, save } from './core/storage.js';
import { getStats } from './core/stats.js';
import { pick } from './core/random.js';
import { berrySvg } from './mascot.js';
import { art } from './art.js';
import { openGame } from './shell.js';
import { games } from './games/index.js';
import { themeToggle, followSystemTheme } from './core/theme.js';
import { fontPicker } from './core/font.js';
import { showCover, dismissCover } from './cover.js';
import { TRAYS, trayForRoute, neighbour, isForward } from './trays.js';
import { turnPage, finishTurn, isTurning } from './page-turn.js';

const SWIPE_PX = 60;

const root = document.getElementById('app');
let closeCurrent = null;
let firstRoute = true;
let shownTray = null;

function settleTray() {
  const home = root.querySelector('.home');
  if (!home) return;
  home.classList.remove('settle');
  home.getBoundingClientRect();
  home.classList.add('settle');
}

function openedFromLoad() {
  settleTray();
  root.querySelector('.sweet')?.focus({ preventScroll: true });
}

function greetingRow(onDone) {
  if (load('bs.nameAsked', false)) return null;
  const input = h('input', {
    id: 'name-input',
    type: 'text',
    maxlength: '24',
    autocomplete: 'off',
    placeholder: 'Your name',
  });
  const finish = (name) => {
    save('bs.nameAsked', true);
    if (name) save('bs.name', name);
    onDone();
  };
  return h('form', {
    class: 'name-row',
    onSubmit: (event) => {
      event.preventDefault();
      finish(input.value.trim());
    },
  },
    h('label', { for: 'name-input' }, 'What should Berry call you?'),
    input,
    h('button', { class: 'btn btn-main', type: 'submit' }, 'Save'),
    h('button', { class: 'btn', type: 'button', onClick: () => finish('') }, 'Skip'),
  );
}

function statsLine() {
  const { finished, days } = getStats();
  if (!finished) return 'Every puzzle has hints and an answer, so you can never get stuck.';
  const puzzles = `${finished} ${finished === 1 ? 'puzzle' : 'puzzles'} finished`;
  const dayText = `over ${days} ${days === 1 ? 'day' : 'days'}`;
  return `${puzzles} ${dayText}.`;
}

function pageHead({ title, sub, extra }) {
  return h('header', { class: 'home-head' },
    h('div', { class: 'home-berry', html: berrySvg }),
    h('div', { class: 'home-words' },
      h('h1', null, title),
      h('p', { class: 'home-sub' }, sub),
    ),
    h('div', { class: 'home-right' },
      h('div', { class: 'home-tools' },
        h('button', {
          class: 'link-button',
          type: 'button',
          onClick: (event) => {
            const link = event.currentTarget;
            showCover({
              root,
              swingShut: true,
              onOpen: () => {
                settleTray();
                link.focus({ preventScroll: true });
              },
            });
          },
        }, 'Close the book'),
        h('div', { class: 'home-switches' }, fontPicker(), themeToggle()),
      ),
      extra,
    ),
  );
}

function puzzlesPage() {
  const name = load('bs.name');
  return h('main', { class: 'home' },
    h('div', { class: 'ribbon', 'aria-hidden': 'true' }),
    pageHead({
      title: 'Brain Snacks',
      sub: name ? `Hello ${name}. Pick something small.` : 'Pick something small.',
      extra: h('button', {
        class: 'surprise',
        type: 'button',
        onClick: () => { location.hash = `#/${pick(games).id}`; },
      }, 'Surprise me'),
    }),
    greetingRow(() => showTray(TRAYS[0])),
    h('nav', { class: 'tray', 'aria-label': 'Puzzles' },
      games.map((game, index) =>
        h('a', { class: `sweet sweet-${game.id}`, href: `#/${game.id}`, style: `--i: ${index}` },
          h('span', { class: 'sweet-name' }, game.title),
          h('span', { class: 'sweet-blurb' }, game.blurb),
          h('span', { class: 'sweet-art', html: art[game.id] }),
        ),
      ),
    ),
    h('p', { class: 'home-foot' }, statsLine()),
  );
}

// A placeholder until the arcade games are built.
function arcadePage() {
  return h('main', { class: 'home' },
    h('div', { class: 'ribbon', 'aria-hidden': 'true' }),
    pageHead({ title: 'Arcade', sub: 'Something livelier, coming soon.' }),
    h('section', { class: 'tray tray-arcade', 'aria-label': 'Arcade' },
      h('div', { class: 'tray-note', style: '--i: 0' },
        h('h2', null, 'This tray is still empty'),
        h('p', null, 'Arcade games will go here.'),
      ),
      ['a', 'b', 'c', 'd', 'e', 'f'].map((slot, index) =>
        h('div', { class: `mould mould-${slot}`, style: `--i: ${index + 1}`, 'aria-hidden': 'true' }),
      ),
    ),
    h('p', { class: 'home-foot' }, 'The puzzles are one page back.'),
  );
}

const PAGES = { puzzles: puzzlesPage, arcade: arcadePage };

function pageCorner(tray, side) {
  return h('a', {
    class: `corner corner-${side}`,
    href: tray.hash,
    'aria-label': `Turn the page to ${tray.label}`,
  }, h('span', { class: 'corner-label' }, tray.label));
}

function buildLeaf(tray) {
  const previous = neighbour(tray, -1);
  const next = neighbour(tray, 1);
  return h('div', { class: 'leaf' },
    PAGES[tray.id](),
    previous && pageCorner(previous, 'back'),
    next && pageCorner(next, 'next'),
  );
}

function showTray(tray) {
  root.replaceChildren(h('div', { class: 'spine', 'aria-hidden': 'true' }), buildLeaf(tray));
}

function titleFor(tray) {
  return tray === TRAYS[0] ? 'Brain Snacks' : `${tray.label} | Brain Snacks`;
}

function routeToTray(tray) {
  const from = shownTray && shownTray !== tray ? root.querySelector('.leaf') : null;
  document.title = titleFor(tray);
  if (from) {
    const to = buildLeaf(tray);
    turnPage({ root, from, to, forward: isForward(shownTray, tray) });
    to.querySelector('.sweet, .corner')?.focus({ preventScroll: true });
  } else {
    window.scrollTo(0, 0);
    showTray(tray);
  }
  shownTray = tray;
}

function route() {
  closeCurrent?.();
  closeCurrent = null;
  finishTurn();
  const id = location.hash.replace(/^#\/?/, '');
  const game = games.find((item) => item.id === id);
  document.body.dataset.view = game ? 'game' : 'home';
  if (game) {
    shownTray = null;
    window.scrollTo(0, 0);
    dismissCover();
    document.title = `${game.title} | Brain Snacks`;
    closeCurrent = openGame(game, root);
  } else {
    const tray = trayForRoute(id);
    routeToTray(tray);
    // The book starts shut whenever the site is opened at its first page.
    if (firstRoute && tray === TRAYS[0]) showCover({ root, onOpen: openedFromLoad });
  }
  firstRoute = false;
}

function stepTray(step) {
  if (!shownTray || isTurning() || document.documentElement.classList.contains('is-covered')) return;
  const tray = neighbour(shownTray, step);
  if (tray) location.hash = tray.hash;
}

function onTrayKey(event) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  if (event.target.tagName === 'INPUT') return;
  if (event.key === 'ArrowRight') stepTray(1);
  if (event.key === 'ArrowLeft') stepTray(-1);
}

let swipeStart = null;

function onSwipeStart(event) {
  swipeStart = event.touches.length === 1
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
    : null;
}

function onSwipeEnd(event) {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 2) stepTray(dx < 0 ? 1 : -1);
}

window.addEventListener('hashchange', route);
document.addEventListener('keydown', onTrayKey);
document.addEventListener('touchstart', onSwipeStart, { passive: true });
document.addEventListener('touchend', onSwipeEnd, { passive: true });
followSystemTheme();
route();
