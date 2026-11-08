import { h } from '../core/dom.js';
import { drawFromBag } from '../core/bag.js';
import { pictures } from '../data/pictures.js';

const UNKNOWN = -1;
const EMPTY = 0;
const FILLED = 1;

export function clueFor(line) {
  const runs = [];
  let count = 0;
  for (const cell of line) {
    if (cell) count++;
    else if (count) {
      runs.push(count);
      count = 0;
    }
  }
  if (count) runs.push(count);
  return runs;
}

const placementCache = new Map();

function placements(clue, length) {
  const key = `${clue.join(',')}/${length}`;
  if (placementCache.has(key)) return placementCache.get(key);
  const out = [];
  (function place(index, from, line) {
    if (index === clue.length) {
      out.push([...line]);
      return;
    }
    const run = clue[index];
    const remaining = clue.slice(index + 1).reduce((sum, value) => sum + value + 1, 0);
    for (let start = from; start + run + remaining <= length; start++) {
      const next = [...line];
      for (let i = start; i < start + run; i++) next[i] = FILLED;
      place(index + 1, start + run + 1, next);
    }
  })(0, 0, new Array(length).fill(EMPTY));
  placementCache.set(key, out);
  return out;
}

// Works out what must be true of a line, given what is already known.
export function deduceLine(clue, known) {
  const options = placements(clue, known.length).filter((line) =>
    line.every((cell, i) => known[i] === UNKNOWN || known[i] === cell),
  );
  if (!options.length) return null;
  return known.map((_, i) => {
    const first = options[0][i];
    return options.every((line) => line[i] === first) ? first : UNKNOWN;
  });
}

export function cluesFor(rows) {
  const grid = rows.map((row) => [...row].map((ch) => ch === '#'));
  const size = grid.length;
  return {
    rowClues: grid.map(clueFor),
    colClues: Array.from({ length: size }, (_, c) => clueFor(grid.map((row) => row[c]))),
  };
}

function lineCells(size, isRow, index) {
  return Array.from({ length: size }, (_, i) => (isRow ? index * size + i : i * size + index));
}

// Finds one square that logic can settle. Fills come before crosses.
export function nextDeduction(rowClues, colClues, known) {
  const size = rowClues.length;
  let cross = null;
  for (const isRow of [true, false]) {
    for (let index = 0; index < size; index++) {
      const cells = lineCells(size, isRow, index);
      const clue = (isRow ? rowClues : colClues)[index];
      const result = deduceLine(clue, cells.map((cell) => known[cell]));
      if (!result) continue;
      for (let i = 0; i < size; i++) {
        if (known[cells[i]] !== UNKNOWN || result[i] === UNKNOWN) continue;
        const found = { cell: cells[i], value: result[i], isRow, line: index + 1 };
        if (result[i] === FILLED) return found;
        cross = cross || found;
      }
    }
  }
  return cross;
}

export function solveByLines(rowClues, colClues) {
  const size = rowClues.length;
  const known = new Array(size * size).fill(UNKNOWN);
  for (;;) {
    const step = nextDeduction(rowClues, colClues, known);
    if (!step) break;
    known[step.cell] = step.value;
  }
  return known;
}

function mount(el, ctx, saved) {
  const size = Number(ctx.level);
  const set = pictures[size];
  const state = saved ?? {
    index: drawFromBag(`picture.${size}`, set.map((_, i) => i)),
    marks: new Array(size * size).fill(0), // 0 blank, 1 filled, 2 crossed
    selected: 0,
    crossMode: false,
  };
  const picture = set[state.index];
  const target = picture.rows.join('').split('').map((ch) => ch === '#');
  const { rowClues, colClues } = cluesFor(picture.rows);
  let finished = false;
  let dragValue = null;
  let lastPoint = null;

  const cellEls = [];
  const rowClueEls = [];
  const colClueEls = [];
  const board = h('div', { class: `ng ng-${size}` });
  board.style.setProperty('--size', size);
  board.append(h('div', { class: 'ng-corner' }));

  const clueNode = (clue, kind) => h('div', { class: `ng-clue ng-clue-${kind}` },
    clue.length ? clue.map((n) => h('span', null, String(n))) : h('span', null, '0'),
  );

  colClues.forEach((clue) => {
    const node = clueNode(clue, 'col');
    colClueEls.push(node);
    board.append(node);
  });

  for (let r = 0; r < size; r++) {
    const node = clueNode(rowClues[r], 'row');
    rowClueEls.push(node);
    board.append(node);
    for (let c = 0; c < size; c++) {
      const index = r * size + c;
      const classes = ['ng-cell'];
      if (c === 4 && size === 8) classes.push('ng-mid-left');
      if (r === 4 && size === 8) classes.push('ng-mid-top');
      const cell = h('button', { class: classes.join(' '), type: 'button', tabindex: '-1', 'data-index': index });
      cellEls.push(cell);
      board.append(cell);
    }
  }

  const crossBtn = h('button', { class: 'btn', type: 'button', onClick: toggleCross }, 'Cross out squares (X)');
  ctx.tools.append(crossBtn);
  el.append(h('div', { class: 'ng-wrap' }, board));

  function lineMatches(cells, clue) {
    return clueFor(cells.map((cell) => state.marks[cell] === 1)).join() === clue.join();
  }

  function paint() {
    cellEls.forEach((cell, i) => {
      const mark = state.marks[i];
      cell.classList.toggle('ng-filled', mark === 1);
      cell.classList.toggle('ng-crossed', mark === 2);
      cell.classList.toggle('ng-selected', i === state.selected && !finished);
      cell.tabIndex = i === state.selected ? 0 : -1;
      const r = Math.floor(i / size) + 1;
      const c = (i % size) + 1;
      cell.setAttribute('aria-label', `Row ${r}, column ${c}, ${['blank', 'filled', 'crossed out'][mark]}`);
    });
    rowClueEls.forEach((node, r) => node.classList.toggle('ng-clue-done', lineMatches(lineCells(size, true, r), rowClues[r])));
    colClueEls.forEach((node, c) => node.classList.toggle('ng-clue-done', lineMatches(lineCells(size, false, c), colClues[c])));
    crossBtn.setAttribute('aria-pressed', String(state.crossMode));
    crossBtn.classList.toggle('btn-on', state.crossMode);
  }

  function toggleCross() {
    state.crossMode = !state.crossMode;
    paint();
    ctx.save();
    cellEls[state.selected].focus({ preventScroll: true });
  }

  function checkSolved() {
    if (target.every((filled, i) => filled === (state.marks[i] === 1))) {
      finished = true;
      state.marks = state.marks.map((mark) => (mark === 1 ? 1 : 0));
      board.classList.add('ng-solved');
      paint();
      ctx.finish({ message: `It's ${picture.name}!` });
      return true;
    }
    return false;
  }

  function setMark(index, value) {
    if (finished || state.marks[index] === value) return;
    state.marks[index] = value;
    paint();
    ctx.save();
    checkSolved();
  }

  function cellAtPoint(x, y) {
    const node = document.elementFromPoint(x, y)?.closest?.('.ng-cell');
    return node && board.contains(node) ? Number(node.dataset.index) : null;
  }

  board.addEventListener('pointerdown', (event) => {
    const node = event.target.closest('.ng-cell');
    if (!node || finished) return;
    event.preventDefault();
    const index = Number(node.dataset.index);
    const crossing = event.button === 2 || state.crossMode;
    const wanted = crossing ? 2 : 1;
    dragValue = state.marks[index] === wanted ? 0 : wanted;
    state.selected = index;
    lastPoint = { x: event.clientX, y: event.clientY };
    node.focus({ preventScroll: true });
    board.setPointerCapture?.(event.pointerId);
    paint();
    setMark(index, dragValue);
  });

  // Fast drags only report a few positions, so walk the path between them.
  board.addEventListener('pointermove', (event) => {
    if (dragValue === null) return;
    const dx = event.clientX - lastPoint.x;
    const dy = event.clientY - lastPoint.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 8));
    for (let i = 1; i <= steps; i++) {
      const index = cellAtPoint(lastPoint.x + (dx * i) / steps, lastPoint.y + (dy * i) / steps);
      if (index !== null) setMark(index, dragValue);
    }
    lastPoint = { x: event.clientX, y: event.clientY };
  });

  const endDrag = () => { dragValue = null; };
  board.addEventListener('pointerup', endDrag);
  board.addEventListener('pointercancel', endDrag);
  board.addEventListener('contextmenu', (event) => event.preventDefault());

  board.addEventListener('keydown', (event) => {
    const moves = { ArrowUp: -size, ArrowDown: size, ArrowLeft: -1, ArrowRight: 1 };
    if (moves[event.key] !== undefined) {
      event.preventDefault();
      const next = state.selected + moves[event.key];
      const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
      if (next >= 0 && next < size * size && (!horizontal || Math.floor(next / size) === Math.floor(state.selected / size))) {
        state.selected = next;
        paint();
        cellEls[next].focus();
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (event.repeat) return;
      const wanted = state.crossMode ? 2 : 1;
      setMark(state.selected, state.marks[state.selected] === wanted ? 0 : wanted);
    } else if (event.key.toLowerCase() === 'x' && !event.repeat && !event.ctrlKey && !event.metaKey) {
      setMark(state.selected, state.marks[state.selected] === 2 ? 0 : 2);
    }
  });

  paint();
  cellEls[state.selected].focus({ preventScroll: true });

  return {
    focus: () => cellEls[state.selected].focus({ preventScroll: true }),
    serialize: () => state,
    hasProgress: () => state.marks.some(Boolean),
    hint() {
      if (finished) return;
      const wrong = state.marks.findIndex((mark, i) => (mark === 1 && !target[i]) || (mark === 2 && target[i]));
      if (wrong !== -1) {
        state.marks[wrong] = 0;
        state.selected = wrong;
        paint();
        ctx.say("I cleared a square that didn't belong.", 'think');
        checkSolved();
        return;
      }
      const known = state.marks.map((mark) => (mark === 1 ? FILLED : mark === 2 ? EMPTY : UNKNOWN));
      const step = nextDeduction(rowClues, colClues, known);
      if (!step) return;
      state.marks[step.cell] = step.value === FILLED ? 1 : 2;
      state.selected = step.cell;
      paint();
      ctx.say(`${step.isRow ? 'Row' : 'Column'} ${step.line} has to ${step.value === FILLED ? 'fill' : 'leave empty'} the square I just marked.`, 'think');
      checkSolved();
    },
    reveal() {
      finished = true;
      state.marks = target.map((filled) => (filled ? 1 : 0));
      board.classList.add('ng-solved');
      paint();
      ctx.finish({ revealed: true, message: `It was ${picture.name}.` });
    },
  };
}

export default {
  id: 'picture',
  title: 'Picture logic',
  blurb: 'Fill in squares to uncover a hidden picture.',
  intro: 'The numbers tell you how many squares to fill in a row, in order. Right-click or press X to cross out.',
  levelName: 'Grid size',
  levels: [
    { id: '5', label: 'Small 5×5' },
    { id: '8', label: 'Big 8×8' },
  ],
  mount,
};
