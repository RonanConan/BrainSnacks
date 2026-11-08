import { h } from '../core/dom.js';
import { shuffle, sample } from '../core/random.js';

const ICONS = [
  ['🍓', 'strawberry'], ['🍒', 'cherries'], ['🍋', 'lemon'], ['🍪', 'cookie'],
  ['🧁', 'cupcake'], ['🍩', 'doughnut'], ['🍉', 'watermelon'], ['🍑', 'peach'],
  ['🍇', 'grapes'], ['🥝', 'kiwi'], ['🍍', 'pineapple'], ['🥑', 'avocado'],
];

export function makeDeck(pairs, rng = Math.random) {
  const chosen = sample(ICONS.map((_, i) => i), pairs, rng);
  return shuffle([...chosen, ...chosen], rng);
}

function mount(el, ctx, saved) {
  const pairs = Number(ctx.level);
  const state = saved ?? { deck: makeDeck(pairs), matched: new Array(pairs * 2).fill(false), turns: 0 };
  state.open = [];
  let finished = false;
  let closeTimer = null;
  let peekTimer = null;
  let peek = [];

  const cards = state.deck.map((icon, i) =>
    h('button', { class: 'mem-card', type: 'button', onClick: () => flip(i) },
      h('span', { class: 'mem-inner' },
        h('span', { class: 'mem-back', 'aria-hidden': 'true' }),
        h('span', { class: 'mem-front', 'aria-hidden': 'true' }, ICONS[icon][0]),
      ),
    ),
  );
  const board = h('div', { class: `mem mem-${pairs}` }, cards);
  el.append(board);

  function paint() {
    cards.forEach((card, i) => {
      const faceUp = state.matched[i] || state.open.includes(i) || peek.includes(i);
      card.classList.toggle('mem-up', faceUp);
      card.classList.toggle('mem-matched', state.matched[i]);
      // Matched cards stay focusable so keyboard players keep their place on the board.
      card.disabled = finished;
      card.setAttribute('aria-disabled', String(state.matched[i]));
      card.setAttribute('aria-label', faceUp ? `Card ${i + 1}, ${ICONS[state.deck[i]][1]}` : `Card ${i + 1}, face down`);
    });
  }

  function closeOpen() {
    clearTimeout(closeTimer);
    closeTimer = null;
    state.open = [];
  }

  function flip(index) {
    if (finished || state.matched[index] || state.open.includes(index)) return;
    if (state.open.length === 2) closeOpen();
    state.open.push(index);
    if (state.open.length === 2) {
      const [a, b] = state.open;
      state.turns += 1;
      if (state.deck[a] === state.deck[b]) {
        state.matched[a] = true;
        state.matched[b] = true;
        state.open = [];
        if (state.matched.every(Boolean)) {
          finished = true;
          paint();
          ctx.finish({ message: `All matched in ${state.turns} turns.` });
          return;
        }
      } else {
        closeTimer = setTimeout(() => {
          closeOpen();
          paint();
        }, 1000);
      }
    }
    paint();
    ctx.save();
  }

  paint();

  return {
    serialize: () => ({ ...state, open: [] }),
    hasProgress: () => state.turns > 0,
    destroy() {
      clearTimeout(closeTimer);
      clearTimeout(peekTimer);
    },
    hint() {
      if (finished) return;
      const hidden = state.deck.map((_, i) => i).filter((i) => !state.matched[i]);
      const first = sample(hidden, 1)[0];
      const twin = hidden.find((i) => i !== first && state.deck[i] === state.deck[first]);
      closeOpen();
      peek = [first, twin];
      clearTimeout(peekTimer);
      peekTimer = setTimeout(() => {
        peek = [];
        paint();
      }, 1500);
      paint();
      ctx.say('Quick, have a peek at this pair.', 'think');
    },
    reveal() {
      finished = true;
      closeOpen();
      peek = [];
      state.matched = state.matched.map(() => true);
      paint();
      ctx.finish({ revealed: true, message: 'Every card, face up.' });
    },
  };
}

export default {
  id: 'memory',
  title: 'Memory match',
  blurb: 'Find the pairs.',
  intro: 'Flip two cards at a time and find the matching pairs.',
  levelName: 'Cards',
  levels: [
    { id: '6', label: '12 cards' },
    { id: '8', label: '16 cards' },
    { id: '10', label: '20 cards' },
  ],
  mount,
};
