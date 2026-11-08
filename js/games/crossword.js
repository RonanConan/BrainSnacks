import { h } from '../core/dom.js';
import { shuffle } from '../core/random.js';
import { drawFromBag } from '../core/bag.js';
import { themes } from '../data/words.js';

const SETTINGS = {
  gentle: { count: 6, max: 9 },
  medium: { count: 7, max: 10 },
  tricky: { count: 8, max: 11 },
};

const cellKey = (r, c) => `${r},${c}`;

function tryBuild(pool, count, max, rng) {
  const cells = new Map();
  const placed = [];
  let box = null;

  const put = (entry, r, c, across) => {
    [...entry.word].forEach((ch, i) => {
      const row = across ? r : r + i;
      const col = across ? c + i : c;
      const key = cellKey(row, col);
      if (!cells.has(key)) cells.set(key, { ch, across: false, down: false, r: row, c: col });
      cells.get(key)[across ? 'across' : 'down'] = true;
    });
    placed.push({ ...entry, r, c, across });
    box = growBox(box, r, c, entry.word.length, across);
  };

  function growBox(current, r, c, length, across) {
    const endR = across ? r : r + length - 1;
    const endC = across ? c + length - 1 : c;
    if (!current) return { top: r, left: c, bottom: endR, right: endC };
    return {
      top: Math.min(current.top, r),
      left: Math.min(current.left, c),
      bottom: Math.max(current.bottom, endR),
      right: Math.max(current.right, endC),
    };
  }

  function score(word, r, c, across) {
    const dr = across ? 0 : 1;
    const dc = across ? 1 : 0;
    if (cells.has(cellKey(r - dr, c - dc))) return null;
    if (cells.has(cellKey(r + dr * word.length, c + dc * word.length))) return null;
    let crossings = 0;
    for (let i = 0; i < word.length; i++) {
      const row = r + dr * i;
      const col = c + dc * i;
      const cell = cells.get(cellKey(row, col));
      if (cell) {
        if (cell.ch !== word[i] || cell[across ? 'across' : 'down']) return null;
        crossings++;
      } else if (cells.has(cellKey(row + dc, col + dr)) || cells.has(cellKey(row - dc, col - dr))) {
        return null;
      }
    }
    if (!crossings) return null;
    const next = growBox(box, r, c, word.length, across);
    const height = next.bottom - next.top + 1;
    const width = next.right - next.left + 1;
    if (height > max || width > max) return null;
    return crossings * 10 - Math.abs(height - width) - (height + width) / 2 + rng() * 3;
  }

  const [first, ...rest] = pool;
  put(first, 0, 0, true);

  for (const entry of rest) {
    if (placed.length === count) break;
    if (entry.word.length > max) continue;
    let best = null;
    for (const cell of cells.values()) {
      if (cell.across && cell.down) continue;
      const across = cell.down;
      [...entry.word].forEach((ch, i) => {
        if (ch !== cell.ch) return;
        const r = across ? cell.r : cell.r - i;
        const c = across ? cell.c - i : cell.c;
        const value = score(entry.word, r, c, across);
        if (value !== null && (!best || value > best.value)) best = { value, r, c, across };
      });
    }
    if (best) put(entry, best.r, best.c, best.across);
  }
  return placed.length === count ? { placed, box } : null;
}

function finishGrid({ placed, box }, theme) {
  const rows = box.bottom - box.top + 1;
  const cols = box.right - box.left + 1;
  const solution = new Array(rows * cols).fill('');
  const shifted = placed.map((entry) => ({ ...entry, r: entry.r - box.top, c: entry.c - box.left }));
  for (const entry of shifted) {
    [...entry.word].forEach((ch, i) => {
      const r = entry.across ? entry.r : entry.r + i;
      const c = entry.across ? entry.c + i : entry.c;
      solution[r * cols + c] = ch;
    });
  }
  const startCells = [...new Set(shifted.map((entry) => entry.r * cols + entry.c))].sort((a, b) => a - b);
  const numberAt = new Map(startCells.map((cell, i) => [cell, i + 1]));
  const entries = shifted
    .map((entry) => ({
      number: numberAt.get(entry.r * cols + entry.c),
      across: entry.across,
      word: entry.word,
      clue: entry.clue,
      cells: [...entry.word].map((_, i) => (entry.across ? entry.r * cols + entry.c + i : (entry.r + i) * cols + entry.c)),
    }))
    .sort((a, b) => Number(b.across) - Number(a.across) || a.number - b.number);
  return { rows, cols, solution, entries, numbers: Object.fromEntries(numberAt), theme };
}

export function generateCrossword(level, themeName, rng = Math.random) {
  const { count, max } = SETTINGS[level];
  const theme = themes.find((item) => item.name === themeName);
  for (;;) {
    const mixed = shuffle(theme.words, rng);
    const head = mixed.slice(0, 10).sort((a, b) => b.word.length - a.word.length)[0];
    const pool = [head, ...mixed.filter((entry) => entry !== head)];
    const built = tryBuild(pool, count, max, rng);
    if (built) return finishGrid(built, theme.name);
  }
}

function mount(el, ctx, saved) {
  const state = saved ?? (() => {
    const puzzle = generateCrossword(ctx.level, drawFromBag('crossword', themes.map((t) => t.name)));
    return {
      puzzle,
      letters: puzzle.solution.map(() => ''),
      locked: puzzle.solution.map(() => false),
      flagged: puzzle.solution.map(() => false),
      selected: puzzle.entries[0].cells[0],
      across: puzzle.entries[0].across,
      hintFor: null,
      hintStage: 0,
    };
  })();
  const { puzzle } = state;
  const { rows, cols, solution, entries } = puzzle;
  let finished = false;

  const input = h('input', {
    class: 'cw-input',
    type: 'text',
    autocomplete: 'off',
    autocapitalize: 'characters',
    spellcheck: 'false',
    'aria-label': 'Type a letter',
    value: ' ',
  });
  const clueBar = h('p', { class: 'cw-current', 'aria-live': 'polite' });
  const gridEl = h('div', { class: 'cw-grid' });
  gridEl.style.setProperty('--cols', cols);
  gridEl.style.setProperty('--rows', rows);

  const cellEls = solution.map((ch, i) => {
    if (!ch) return h('div', { class: 'cw-block' });
    const number = puzzle.numbers[i];
    const cell = h('div', { class: 'cw-cell', onMousedown: (event) => { event.preventDefault(); clickCell(i); } },
      number ? h('span', { class: 'cw-num' }, String(number)) : null,
      h('span', { class: 'cw-letter' }),
    );
    return cell;
  });
  gridEl.append(...cellEls);

  const clueEls = new Map();
  const clueList = (across) => h('div', { class: 'cw-clues' },
    h('h2', null, across ? 'Across' : 'Down'),
    h('ol', null, entries.filter((entry) => entry.across === across).map((entry) => {
      const item = h('li', {
        onMousedown: (event) => {
          event.preventDefault();
          selectEntry(entry);
        },
      }, h('b', null, String(entry.number)), ` ${entry.clue} (${entry.word.length})`);
      clueEls.set(entry, item);
      return item;
    })),
  );

  el.append(
    h('div', { class: 'cw' },
      h('div', { class: 'cw-left' },
        h('p', { class: 'cw-theme' }, `Theme: ${puzzle.theme}`),
        h('div', { class: 'cw-grid-wrap' }, gridEl, input),
        clueBar,
      ),
      h('div', { class: 'cw-right' }, clueList(true), clueList(false)),
    ),
  );

  const entriesAt = (cell) => entries.filter((entry) => entry.cells.includes(cell));
  function currentEntry() {
    const found = entriesAt(state.selected);
    return found.find((entry) => entry.across === state.across) || found[0];
  }

  function paint() {
    const active = currentEntry();
    state.across = active.across;
    solution.forEach((ch, i) => {
      if (!ch) return;
      const cell = cellEls[i];
      cell.querySelector('.cw-letter').textContent = state.letters[i];
      cell.classList.toggle('cw-selected', i === state.selected);
      cell.classList.toggle('cw-word', active.cells.includes(i));
      cell.classList.toggle('cw-locked', state.locked[i]);
      cell.classList.toggle('cw-flag', state.flagged[i]);
    });
    clueBar.textContent = `${active.number} ${active.across ? 'across' : 'down'}: ${active.clue}`;
    for (const [entry, item] of clueEls) {
      item.classList.toggle('cw-clue-on', entry === active);
      item.classList.toggle('cw-clue-done', entry.cells.every((cell) => state.letters[cell]));
    }
  }

  function focusInput() {
    input.focus({ preventScroll: true });
  }

  function clickCell(index) {
    if (index === state.selected && entriesAt(index).length > 1) state.across = !state.across;
    else if (entriesAt(index).length === 1) state.across = entriesAt(index)[0].across;
    state.selected = index;
    paint();
    focusInput();
  }

  function selectEntry(entry) {
    state.across = entry.across;
    state.selected = entry.cells.find((cell) => !state.letters[cell]) ?? entry.cells[0];
    paint();
    focusInput();
  }

  function checkSolved() {
    if (solution.every((ch, i) => ch === state.letters[i])) {
      finished = true;
      gridEl.classList.add('cw-solved');
      paint();
      ctx.finish();
      return true;
    }
    return false;
  }

  function typeLetter(letter) {
    if (finished) return;
    const index = state.selected;
    if (!state.locked[index]) {
      state.letters[index] = letter;
      state.flagged[index] = false;
    }
    const entry = currentEntry();
    const at = entry.cells.indexOf(index);
    if (at < entry.cells.length - 1) state.selected = entry.cells[at + 1];
    paint();
    ctx.save();
    if (!checkSolved() && solution.every((ch, i) => !ch || state.letters[i])) {
      ctx.say("Every square is filled, but something doesn't fit. Ask for a hint and I'll mark it.", 'think');
    }
  }

  function backspace() {
    if (finished) return;
    const index = state.selected;
    if (state.letters[index] && !state.locked[index]) {
      state.letters[index] = '';
      state.flagged[index] = false;
    } else {
      const entry = currentEntry();
      const at = entry.cells.indexOf(index);
      if (at > 0) {
        state.selected = entry.cells[at - 1];
        if (!state.locked[state.selected]) {
          state.letters[state.selected] = '';
          state.flagged[state.selected] = false;
        }
      }
    }
    paint();
    ctx.save();
  }

  function moveArrow(dr, dc) {
    const across = dc !== 0;
    if (across !== state.across && entriesAt(state.selected).some((entry) => entry.across === across)) {
      state.across = across;
      paint();
      return;
    }
    let r = Math.floor(state.selected / cols) + dr;
    let c = (state.selected % cols) + dc;
    while (r >= 0 && r < rows && c >= 0 && c < cols) {
      if (solution[r * cols + c]) {
        state.selected = r * cols + c;
        paint();
        return;
      }
      r += dr;
      c += dc;
    }
  }

  function stepEntry(direction) {
    const at = entries.indexOf(currentEntry());
    selectEntry(entries[(at + direction + entries.length) % entries.length]);
  }

  input.addEventListener('keydown', (event) => {
    const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (moves[event.key]) {
      event.preventDefault();
      moveArrow(...moves[event.key]);
    } else if (event.key === 'Tab') {
      event.preventDefault();
      stepEntry(event.shiftKey ? -1 : 1);
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      backspace();
    } else if (event.key === 'Escape') {
      input.blur();
    } else if (/^[a-zA-Z]$/.test(event.key) && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      typeLetter(event.key.toUpperCase());
    }
  });

  // Phone keyboards don't report keys, so read what lands in the input instead.
  input.addEventListener('input', () => {
    const typed = input.value.replace(/[^a-zA-Z]/g, '');
    if (typed) [...typed].forEach((letter) => typeLetter(letter.toUpperCase()));
    else if (input.value === '') backspace();
    input.value = ' ';
  });

  input.addEventListener('focus', () => gridEl.classList.add('cw-focused'));
  input.addEventListener('blur', () => gridEl.classList.remove('cw-focused'));

  paint();
  focusInput();

  const isCellRight = (cell) => state.letters[cell] === solution[cell];
  const lockCell = (cell) => {
    state.letters[cell] = solution[cell];
    state.locked[cell] = true;
    state.flagged[cell] = false;
  };

  return {
    serialize: () => state,
    hasProgress: () => state.letters.some(Boolean),
    hint() {
      if (finished) return;
      let entry = currentEntry();
      if (entry.cells.every(isCellRight)) {
        entry = entries.find((item) => !item.cells.every(isCellRight));
        if (!entry) return;
        selectEntry(entry);
      }
      const id = `${entry.number}${entry.across}`;
      if (state.hintFor !== id) {
        state.hintFor = id;
        state.hintStage = 0;
      }
      if (state.hintStage === 0) {
        state.hintStage = 1;
        let count = 0;
        solution.forEach((ch, i) => {
          if (ch && state.letters[i] && state.letters[i] !== ch) {
            state.flagged[i] = true;
            count++;
          }
        });
        if (count) {
          paint();
          ctx.say(`I've marked ${count === 1 ? 'the letter' : `${count} letters`} that ${count === 1 ? "doesn't" : "don't"} fit.`, 'think');
          return;
        }
      }
      if (state.hintStage === 1) {
        state.hintStage = 2;
        const cell = entry.cells.find((item) => !isCellRight(item));
        lockCell(cell);
        paint();
        ctx.save();
        ctx.say('Here is one letter. Ask again for the whole word.', 'think');
        checkSolved();
        return;
      }
      entry.cells.forEach(lockCell);
      state.hintFor = null;
      paint();
      ctx.save();
      ctx.say('There is that word.', 'happy');
      checkSolved();
    },
    reveal() {
      finished = true;
      state.letters = [...solution];
      paint();
      ctx.finish({ revealed: true });
    },
  };
}

export default {
  id: 'crossword',
  title: 'Mini crossword',
  blurb: 'A few words, one theme.',
  intro: 'Click a square and type. Tab jumps to the next clue, and clicking a square twice turns the direction.',
  levelName: 'Size',
  levels: [
    { id: 'gentle', label: 'Gentle' },
    { id: 'medium', label: 'Medium' },
    { id: 'tricky', label: 'Tricky' },
  ],
  typing: true,
  mount,
};
