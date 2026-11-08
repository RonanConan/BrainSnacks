import { h } from './core/dom.js';
import { load, save } from './core/storage.js';
import { getStats } from './core/stats.js';
import { pick } from './core/random.js';
import { berrySvg } from './mascot.js';
import { art } from './art.js';
import { openGame } from './shell.js';
import { games } from './games/index.js';

const root = document.getElementById('app');
let closeCurrent = null;

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
    games.map((game) =>
      h('a', { class: `sweet sweet-${game.id}`, href: `#/${game.id}` },
        h('span', { class: 'sweet-name' }, game.title),
        h('span', { class: 'sweet-blurb' }, game.blurb),
        h('span', { class: 'sweet-art', html: art[game.id] }),
      ),
    ),
  );
  root.replaceChildren(
    h('main', { class: 'home' },
      h('header', { class: 'home-head' },
        h('div', { class: 'home-berry', html: berrySvg }),
        h('div', { class: 'home-words' },
          h('h1', null, 'Brain Snacks'),
          h('p', { class: 'home-sub' }, name ? `Hello ${name}. Pick something small.` : 'Pick something small.'),
        ),
        h('button', {
          class: 'surprise',
          type: 'button',
          onClick: () => { location.hash = `#/${pick(games).id}`; },
        }, 'Surprise me'),
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
  if (game) {
    document.title = `${game.title} | Brain Snacks`;
    closeCurrent = openGame(game, root);
  } else {
    renderHome();
  }
}

window.addEventListener('hashchange', route);
route();
