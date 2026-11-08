import { h } from '../core/dom.js';
import { shuffle } from '../core/random.js';

// Box width and height for each grid size.
const BOX = { 4: [2, 2], 6: [3, 2], 9: [3, 3] };
const TARGET_GIVENS = { 4: 6, 6: 14, 9: 38 };

const layoutCache = new Map();

export function layout(size) {
  if (layoutCache.has(size)) return layoutCache.get(size);
  const [boxW, boxH] = BOX[size];
  const units = [];
  for (let r = 0; r < size; r++) {
    units.push({ kind: 'row', number: r + 1, cells: Array.from({ length: size }, (_, c) => r * size + c) });
  }
  for (let c = 0; c < size; c++) {
    units.push({ kind: 'column', number: c + 1, cells: Array.from({ length: size }, (_, r) => r * size + c) });
  }
  let boxNumber = 1;
  for (let top = 0; top < size; top += boxH) {
    for (let left = 0; left < size; left += boxW) {
      const cells = [];
      for (let r = top; r < top + boxH; r++) {
        for (let c = left; c < left + boxW; c++) cells.push(r * size + c);
      }
      units.push({ kind: 'box', number: boxNumber++, cells });
    }
  }
  const peers = Array.from({ length: size * size }, (_, index) => {
    const set = new Set();
    for (const unit of units) {
      if (unit.cells.includes(index)) unit.cells.forEach((cell) => set.add(cell));
    }
    set.delete(index);
    return [...set];
  });
  const result = { units, peers };
  layoutCache.set(size, result);
  return result;
}

function candidates(grid, size, index) {
  const used = new Set(layout(size).peers[index].map((peer) => grid[peer]));
  const out = [];
  for (let value = 1; value <= size; value++) if (!used.has(value)) out.push(value);
  return out;
}

function fill(grid, size, rng) {
  let best = -1;
  let bestOptions = null;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) continue;
    const options = candidates(grid, size, i);
    if (!bestOptions || options.length < bestOptions.length) {
      best = i;
      bestOptions = options;
      if (options.length <= 1) break;
    }
  }
  if (best === -1) return true;
  for (const value of shuffle(bestOptions, rng)) {
    grid[best] = value;
    if (fill(grid, size, rng)) return true;
  }
  grid[best] = 0;
  return false;
}

export function countSolutions(input, size, limit = 2) {
  const grid = [...input];
  let found = 0;
  (function search() {
    let best = -1;
    let bestOptions = null;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i]) continue;
      const options = candidates(grid, size, i);
      if (!bestOptions || options.length < bestOptions.length) {
        best = i;
        bestOptions = options;
        if (options.length <= 1) break;
      }
    }
    if (best === -1) {
      found++;
      return;
    }
    for (const value of bestOptions) {
      grid[best] = value;
      search();
      if (found >= limit) break;
    }
    grid[best] = 0;
  })();
  return found;
}

// Finds one square a person could fill by plain reasoning.
export function findSingle(grid, size) {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) continue;
    const options = candidates(grid, size, i);
    if (options.length === 1) return { index: i, value: options[0], kind: 'naked' };
  }
  for (const unit of layout(size).units) {
    for (let value = 1; value <= size; value++) {
      if (unit.cells.some((cell) => grid[cell] === value)) continue;
      const spots = unit.cells.filter((cell) => !grid[cell] && candidates(grid, size, cell).includes(value));
      if (spots.length === 1) {
        return { index: spots[0], value, kind: 'hidden', unit: unit.kind, number: unit.number };
      }
    }
  }
  return null;
}

export function solveBySingles(input, size) {
  const grid = [...input];
  for (;;) {
    const step = findSingle(grid, size);
    if (!step) break;
    grid[step.index] = step.value;
  }
  return grid.every(Boolean) ? grid : null;
}

export function generate(size, rng = Math.random) {
  const solution = new Array(size * size).fill(0);
  fill(solution, size, rng);
  const puzzle = [...solution];
  let givens = puzzle.length;
  for (const index of shuffle(puzzle.map((_, i) => i), rng)) {
    if (givens <= TARGET_GIVENS[size]) break;
    const kept = puzzle[index];
    puzzle[index] = 0;
    if (solveBySingles(puzzle, size)) givens--;
    else puzzle[index] = kept;
  }
  return { puzzle, solution };
}

function explain(step) {
  if (step.kind === 'naked') {
    return `Look at the highlighted square. Its row, column and box already use every number except ${step.value}.`;
  }
  const place = step.unit === 'box' ? "this box" : `${step.unit} ${step.number}`;
  return `Look at ${place}. The ${step.value} can only go in the highlighted square. Ask again and I'll fill it in.`;
}

function mount(el, ctx, saved) {
  const size = Number(ctx.level);
  const count = size * size;
  const { peers } = layout(size);
  const [boxW, boxH] = BOX[size];

  let state = saved;
  if (!state) {
    const { puzzle, solution } = generate(size);
    state = {
      puzzle,
      solution,
      cells: [...puzzle],
      notes: new Array(count).fill(0),
      selected: puzzle.findIndex((value) => !value),
      noteMode: false,
    };
  }

  let finished = false;
  let hintCell = null;
  let flaggedWrong = null;
  const cellEls = [];

  const gridEl = h('div', { class: `sudoku sudoku-${size}`, role: 'group', 'aria-label': 'Sudoku grid' });
  gridEl.style.setProperty('--size', size);

  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / size);
    const c = i % size;
    const classes = ['cell'];
    if ((c + 1) % boxW === 0 && c + 1 < size) classes.push('box-right');
    if ((r + 1) % boxH === 0 && r + 1 < size) classes.push('box-bottom');
    const cell = h('button', {
      class: classes.join(' '),
      type: 'button',
      tabindex: '-1',
      style: `--d: ${r + c}`,
      onClick: () => select(i),
    });
    cellEls.push(cell);
    gridEl.append(cell);
  }

  const noteBtn = h('button', { class: 'tab tab-tool', type: 'button', onClick: toggleNotes }, 'Pencil notes (P)');
  const pad = h('div', { class: `pad pad-${size}`, role: 'group', 'aria-label': 'Number pad' },
    Array.from({ length: size }, (_, i) =>
      h('button', { class: 'pad-key', type: 'button', onClick: () => enter(i + 1) }, String(i + 1)),
    ),
    h('button', { class: 'pad-key pad-erase', type: 'button', onClick: erase }, 'Erase'),
  );
  ctx.tools.append(noteBtn);
  el.append(h('div', { class: 'sudoku-wrap' }, gridEl, pad));

  gridEl.addEventListener('keydown', onKey);

  function conflicts() {
    const bad = new Set();
    state.cells.forEach((value, i) => {
      if (value && peers[i].some((peer) => state.cells[peer] === value)) bad.add(i);
    });
    return bad;
  }

  function notesHtml(mask) {
    let out = '';
    for (let value = 1; value <= size; value++) {
      out += `<i>${mask & (1 << value) ? value : ''}</i>`;
    }
    return `<span class="notes notes-${size}">${out}</span>`;
  }

  function paint() {
    const bad = conflicts();
    const selectedValue = state.cells[state.selected];
    const related = new Set(peers[state.selected]);
    cellEls.forEach((cell, i) => {
      const value = state.cells[i];
      if (value) cell.textContent = String(value);
      else if (state.notes[i]) cell.innerHTML = notesHtml(state.notes[i]);
      else cell.textContent = '';
      cell.classList.toggle('given', Boolean(state.puzzle[i]));
      cell.classList.toggle('selected', i === state.selected);
      cell.classList.toggle('related', related.has(i));
      cell.classList.toggle('same', Boolean(value) && value === selectedValue && i !== state.selected);
      cell.classList.toggle('conflict', bad.has(i));
      cell.classList.toggle('hinted', i === hintCell);
      cell.tabIndex = i === state.selected ? 0 : -1;
      const r = Math.floor(i / size) + 1;
      const c = (i % size) + 1;
      cell.setAttribute('aria-label', `Row ${r}, column ${c}, ${value || 'empty'}`);
    });
    noteBtn.setAttribute('aria-pressed', String(state.noteMode));
    noteBtn.classList.toggle('btn-on', state.noteMode);
  }

  function select(index, focus = true) {
    state.selected = index;
    paint();
    if (focus) cellEls[index].focus();
  }

  function toggleNotes() {
    state.noteMode = !state.noteMode;
    paint();
    cellEls[state.selected].focus();
  }

  function checkSolved() {
    if (state.cells.every((value, i) => value === state.solution[i])) {
      finished = true;
      hintCell = null;
      gridEl.classList.add('solved');
      paint();
      ctx.finish();
    }
  }

  function setValue(index, value) {
    state.cells[index] = value;
    state.notes[index] = 0;
    if (value) {
      const bit = 1 << value;
      peers[index].forEach((peer) => { state.notes[peer] &= ~bit; });
      cellEls[index].classList.add('pop');
      cellEls[index].addEventListener('animationend', () => cellEls[index].classList.remove('pop'), { once: true });
    }
    if (hintCell === index) hintCell = null;
    if (flaggedWrong === index) flaggedWrong = null;
  }

  function enter(value) {
    const index = state.selected;
    if (finished || state.puzzle[index]) return;
    if (state.noteMode && !state.cells[index]) {
      state.notes[index] ^= 1 << value;
    } else {
      setValue(index, state.cells[index] === value ? 0 : value);
    }
    paint();
    cellEls[index].focus();
    ctx.save();
    checkSolved();
  }

  function erase() {
    const index = state.selected;
    if (finished || state.puzzle[index]) return;
    setValue(index, 0);
    paint();
    cellEls[index].focus();
    ctx.save();
  }

  function onKey(event) {
    const { key } = event;
    const moves = { ArrowUp: -size, ArrowDown: size, ArrowLeft: -1, ArrowRight: 1 };
    if (moves[key] !== undefined) {
      event.preventDefault();
      const next = state.selected + moves[key];
      const sameRow = Math.floor(next / size) === Math.floor(state.selected / size);
      const horizontal = key === 'ArrowLeft' || key === 'ArrowRight';
      if (next >= 0 && next < count && (!horizontal || sameRow)) select(next);
    } else if (/^[1-9]$/.test(key) && Number(key) <= size && !event.repeat) {
      enter(Number(key));
    } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
      erase();
    } else if (key.toLowerCase() === 'p' && !event.repeat && !event.ctrlKey && !event.metaKey) {
      toggleNotes();
    }
  }

  paint();
  cellEls[state.selected]?.focus();

  return {
    focus: () => cellEls[state.selected].focus(),
    serialize: () => state,
    hasProgress: () => state.cells.some((value, i) => value !== state.puzzle[i]) || state.notes.some(Boolean),
    hint() {
      if (finished) return;
      const wrong = state.cells.findIndex((value, i) => value && value !== state.solution[i]);
      if (wrong !== -1) {
        if (flaggedWrong === wrong) {
          setValue(wrong, 0);
          flaggedWrong = null;
          hintCell = null;
          select(wrong);
          ctx.say("I cleared that square for you. Ask again when you'd like another nudge.", 'idle');
          return;
        }
        flaggedWrong = wrong;
        hintCell = wrong;
        select(wrong);
        ctx.say("This number doesn't fit the solution. Ask again and I'll clear it.", 'think');
        return;
      }
      if (hintCell !== null && !state.cells[hintCell]) {
        const index = hintCell;
        setValue(index, state.solution[index]);
        select(index);
        ctx.say('Filled it in for you.', 'happy');
        checkSolved();
        return;
      }
      const step = findSingle(state.cells, size);
      if (!step) return;
      hintCell = step.index;
      select(step.index);
      ctx.say(explain(step), 'think');
    },
    reveal() {
      finished = true;
      hintCell = null;
      state.cells = [...state.solution];
      state.notes = new Array(count).fill(0);
      paint();
      ctx.finish({ revealed: true });
    },
  };
}

export default {
  id: 'sudoku',
  title: 'Sudoku',
  blurb: 'Fill the grid so no number repeats.',
  intro: 'Every row, column and box needs each number once. Use the arrow keys and type numbers, or click.',
  levelName: 'Grid size',
  levels: [
    { id: '4', label: 'Tiny 4×4' },
    { id: '6', label: 'Gentle 6×6' },
    { id: '9', label: 'Easy 9×9' },
  ],
  defaultLevel: '6',
  mount,
};
