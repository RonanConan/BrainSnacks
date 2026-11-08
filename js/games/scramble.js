import { h } from '../core/dom.js';
import { shuffle } from '../core/random.js';
import { drawFromBag } from '../core/bag.js';
import { allWords } from '../data/words.js';

const LENGTHS = { gentle: [4, 5], medium: [6, 6], tricky: [7, 8] };

export function poolFor(level) {
  const [min, max] = LENGTHS[level];
  return allWords.filter(({ word }) => word.length >= min && word.length <= max).map(({ word }) => word);
}

export function scramble(word, rng = Math.random) {
  for (;;) {
    const letters = shuffle([...word], rng);
    if (letters.join('') !== word) return letters;
  }
}

function mount(el, ctx, saved) {
  const state = saved ?? (() => {
    const word = drawFromBag(`scramble.${ctx.level}`, poolFor(ctx.level));
    return {
      word,
      tiles: scramble(word).map((letter, id) => ({ id, letter })),
      slots: new Array(word.length).fill(null),
      locked: new Array(word.length).fill(false),
      hintStep: 0,
    };
  })();
  const entry = allWords.find((item) => item.word === state.word);
  let finished = false;

  const slotEls = state.slots.map((_, i) => h('button', { type: 'button', onClick: () => takeBack(i) }));
  const tileEls = state.tiles.map((tile) => h('button', { type: 'button', onClick: () => place(tile) }, tile.letter));
  const slotRow = h('div', { class: 'sc-slots' }, slotEls);
  const tileRow = h('div', { class: 'sc-tiles' }, tileEls);
  const allowedAnswers = new Set(allWords.map((item) => item.word));
  const sorted = (text) => [...text].sort().join('');

  el.append(
    h('div', { class: 'sc' },
      h('p', { class: 'sc-theme' }, entry.theme),
      slotRow,
      tileRow,
      h('button', { class: 'btn', type: 'button', onClick: clearAll }, 'Clear my letters'),
    ),
  );

  const tileById = (id) => state.tiles.find((tile) => tile.id === id);
  const isUsed = (id) => state.slots.includes(id);
  const currentWord = () => state.slots.map((id) => (id === null ? '' : tileById(id).letter)).join('');

  // Buttons are updated in place, never rebuilt or disabled, so keyboard focus stays put.
  function setInactive(button, inactive) {
    button.setAttribute('aria-disabled', String(inactive));
    button.tabIndex = inactive ? -1 : 0;
  }

  function paint() {
    slotEls.forEach((slot, i) => {
      const id = state.slots[i];
      const letter = id === null ? '' : tileById(id).letter;
      slot.className = `sc-slot${state.locked[i] ? ' sc-slot-locked' : ''}${id === null ? '' : ' sc-slot-full'}`;
      slot.textContent = letter;
      slot.setAttribute('aria-label', id === null ? `Space ${i + 1}, empty` : `Space ${i + 1}, ${letter}`);
      setInactive(slot, state.locked[i] || id === null || finished);
    });
    tileEls.forEach((button, i) => {
      const used = isUsed(state.tiles[i].id);
      button.className = `sc-tile${used ? ' sc-tile-used' : ''}`;
      setInactive(button, used || finished);
    });
  }

  function checkAnswer() {
    if (state.slots.includes(null)) return;
    const guess = currentWord();
    if (guess === state.word || (allowedAnswers.has(guess) && sorted(guess) === sorted(state.word))) {
      finished = true;
      paint();
      ctx.finish({ message: `Yes, ${guess}!` });
    } else {
      ctx.say("Not quite. Click a letter to take it back, or ask for a hint.", 'think');
    }
  }

  function place(tile) {
    if (finished || isUsed(tile.id)) return;
    const slot = state.slots.indexOf(null);
    if (slot === -1) return;
    state.slots[slot] = tile.id;
    paint();
    ctx.save();
    checkAnswer();
  }

  function takeBack(slot) {
    if (finished || state.locked[slot] || state.slots[slot] === null) return;
    state.slots[slot] = null;
    paint();
    ctx.save();
  }

  function clearAll() {
    if (finished) return;
    state.slots = state.slots.map((id, i) => (state.locked[i] ? id : null));
    paint();
    ctx.save();
  }

  function onKey(event) {
    if (finished || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.tagName === 'INPUT') return;
    if (event.key === 'Backspace') {
      event.preventDefault();
      for (let i = state.slots.length - 1; i >= 0; i--) {
        if (state.slots[i] !== null && !state.locked[i]) {
          takeBack(i);
          return;
        }
      }
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      const letter = event.key.toUpperCase();
      const tile = state.tiles.find((item) => item.letter === letter && !isUsed(item.id));
      if (tile) place(tile);
    }
  }

  document.addEventListener('keydown', onKey);
  paint();

  function lockNext() {
    const slot = state.locked.findIndex((locked, i) => !locked && (state.slots[i] === null || tileById(state.slots[i]).letter !== state.word[i]));
    const position = slot === -1 ? state.locked.indexOf(false) : slot;
    if (position === -1) return;
    const needed = state.word[position];
    const lockedIds = new Set(state.slots.filter((id, i) => state.locked[i]));
    const candidates = state.tiles.filter((tile) => tile.letter === needed && !lockedIds.has(tile.id));
    const tile = candidates.find((item) => !isUsed(item.id)) || candidates[0];
    const from = state.slots.indexOf(tile.id);
    if (from !== -1) state.slots[from] = null;
    state.slots[position] = tile.id;
    state.locked[position] = true;
  }

  return {
    serialize: () => state,
    hasProgress: () => state.slots.some((id) => id !== null),
    destroy: () => document.removeEventListener('keydown', onKey),
    hint() {
      if (finished) return;
      if (state.hintStep === 0) {
        state.hintStep = 1;
        ctx.say(entry.clue, 'think');
        return;
      }
      lockNext();
      paint();
      ctx.say("I've locked a letter in the right place.", 'think');
      checkAnswer();
    },
    reveal() {
      finished = true;
      state.slots = [...state.word].map(() => null);
      const free = [...state.tiles];
      [...state.word].forEach((letter, i) => {
        const at = free.findIndex((tile) => tile.letter === letter);
        state.slots[i] = free.splice(at, 1)[0].id;
      });
      paint();
      ctx.finish({ revealed: true, message: `It was ${state.word}. ${entry.clue}.` });
    },
  };
}

export default {
  id: 'scramble',
  title: 'Word scramble',
  blurb: 'Put the letters back in order.',
  intro: 'Click the letters or type them to spell the word.',
  levelName: 'Word length',
  levels: [
    { id: 'gentle', label: 'Short' },
    { id: 'medium', label: 'Medium' },
    { id: 'tricky', label: 'Long' },
  ],
  typing: true,
  mount,
};
