import test from 'node:test';
import assert from 'node:assert/strict';
import { allWords, themes } from '../js/data/words.js';
import { generateCrossword } from '../js/games/crossword.js';
import { poolFor, scramble } from '../js/games/scramble.js';
import { makeRng } from '../js/core/random.js';

test('the word bank is clean', () => {
  const seen = new Set();
  for (const { word, clue } of allWords) {
    assert.match(word, /^[A-Z]{3,8}$/, word);
    assert.ok(!seen.has(word), `${word} appears twice`);
    seen.add(word);
    assert.ok(clue && clue.length > 2, `${word} needs a clue`);
    assert.ok(!clue.toUpperCase().split(/[^A-Z]+/).includes(word), `${word} is in its own clue`);
  }
  assert.ok(allWords.length >= 380, `only ${allWords.length} words`);
});

function runs(grid, rows, cols) {
  const found = [];
  const walk = (length, get) => {
    let current = [];
    for (let i = 0; i <= length; i++) {
      const ch = i < length ? get(i) : '';
      if (ch) current.push(ch);
      else {
        if (current.length >= 2) found.push(current.join(''));
        current = [];
      }
    }
  };
  for (let r = 0; r < rows; r++) walk(cols, (c) => grid[r * cols + c]);
  for (let c = 0; c < cols; c++) walk(rows, (r) => grid[r * cols + c]);
  return found;
}

function isConnected(grid, rows, cols) {
  const start = grid.findIndex(Boolean);
  const seen = new Set([start]);
  const stack = [start];
  while (stack.length) {
    const at = stack.pop();
    const r = Math.floor(at / cols);
    const c = at % cols;
    for (const [nr, nc] of [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]) {
      const next = nr * cols + nc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[next] && !seen.has(next)) {
        seen.add(next);
        stack.push(next);
      }
    }
  }
  return seen.size === grid.filter(Boolean).length;
}

const SIZES = { gentle: [6, 9], medium: [7, 10], tricky: [8, 11] };

for (const [level, [count, max]] of Object.entries(SIZES)) {
  test(`${level}: 1,000 crosswords are valid`, () => {
    const rng = makeRng(level.length * 31);
    for (let i = 0; i < 1000; i++) {
      const theme = themes[i % themes.length].name;
      const puzzle = generateCrossword(level, theme, rng);
      assert.equal(puzzle.entries.length, count);
      assert.ok(puzzle.rows <= max && puzzle.cols <= max);
      assert.ok(isConnected(puzzle.solution, puzzle.rows, puzzle.cols));
      const expected = puzzle.entries.map((entry) => entry.word).sort();
      assert.deepEqual(runs(puzzle.solution, puzzle.rows, puzzle.cols).sort(), expected);
      assert.equal(new Set(expected).size, expected.length);
      for (const entry of puzzle.entries) {
        assert.equal(entry.cells.map((cell) => puzzle.solution[cell]).join(''), entry.word);
        assert.equal(puzzle.numbers[entry.cells[0]], entry.number);
      }
    }
  });
}

test('scrambles never come out already solved', () => {
  const rng = makeRng(5);
  for (const level of ['gentle', 'medium', 'tricky']) {
    const pool = poolFor(level);
    assert.ok(pool.length > 30, level);
    for (const word of pool) {
      for (let i = 0; i < 20; i++) {
        const letters = scramble(word, rng);
        assert.notEqual(letters.join(''), word);
        assert.equal([...letters].sort().join(''), [...word].sort().join(''));
      }
    }
  }
});
