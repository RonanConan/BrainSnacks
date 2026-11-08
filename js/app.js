import { h } from './core/dom.js';
import { load, save } from './core/storage.js';
import { getStats } from './core/stats.js';
import { pick } from './core/random.js';
import { berrySvg } from './mascot.js';
import { art } from './art.js';
import { openGame } from './shell.js';
import { games } from './games/index.js';
import { themeToggle, followSystemTheme } from './core/theme.js';
import { showCover, dismissCover } from './cover.js';

const root = document.getElementById('app');
let closeCurrent = null;
let firstRoute = true;

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

function renderHome() {
  document.title = 'Brain Snacks';
  const name = load('bs.name');
  const tray = h('nav', { class: 'tray', 'aria-label': 'Puzzles' },
    games.map((game, index) =>
      h('a', { class: `sweet sweet-${game.id}`, href: `#/${game.id}`, style: `--i: ${index}` },
        h('span', { class: 'sweet-name' }, game.title),
        h('span', { class: 'sweet-blurb' }, game.blurb),
        h('span', { class: 'sweet-art', html: art[game.id] }),
      ),
    ),
  );
  root.replaceChildren(
    h('div', { class: 'spine', 'aria-hidden': 'true' }),
    h('main', { class: 'home' },
      h('div', { class: 'ribbon', 'aria-hidden': 'true' }),
      h('header', { class: 'home-head' },
        h('div', { class: 'home-berry', html: berrySvg }),
        h('div', { class: 'home-words' },
          h('h1', null, 'Brain Snacks'),
          h('p', { class: 'home-sub' }, name ? `Hello ${name}. Pick something small.` : 'Pick something small.'),
        ),
        h('div', { class: 'home-right' },
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
          themeToggle(),
          h('button', {
            class: 'surprise',
            type: 'button',
            onClick: () => { location.hash = `#/${pick(games).id}`; },
          }, 'Surprise me'),
        ),
      ),
      greetingRow(renderHome),
      tray,
      h('p', { class: 'home-foot' }, statsLine()),
    ),
  );
}

function route() {
  closeCurrent?.();
  closeCurrent = null;
  const id = location.hash.replace(/^#\/?/, '');
  const game = games.find((item) => item.id === id);
  window.scrollTo(0, 0);
  document.body.dataset.view = game ? 'game' : 'home';
  if (game) {
    dismissCover();
    document.title = `${game.title} | Brain Snacks`;
    closeCurrent = openGame(game, root);
  } else {
    renderHome();
    // The book starts shut whenever the site is opened at its home page.
    if (firstRoute) showCover({ root, onOpen: openedFromLoad });
  }
  firstRoute = false;
}

window.addEventListener('hashchange', route);
followSystemTheme();
route();
