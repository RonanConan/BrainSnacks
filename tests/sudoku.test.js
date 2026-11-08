import test from 'node:test';
import assert from 'node:assert/strict';
import { generate, countSolutions, solveBySingles, layout } from '../js/games/sudoku.js';
import { makeRng } from '../js/core/random.js';

for (const [size, runs, maxGivens] of [[4, 400, 9], [6, 400, 18], [9, 200, 44]]) {
  test(`${size}x${size} puzzles have exactly one solution and need no guessing`, () => {
    const rng = makeRng(size * 101);
    for (let i = 0; i < runs; i++) {
      const { puzzle, solution } = generate(size, rng);
      assert.equal(countSolutions(puzzle, size), 1);
      assert.deepEqual(solveBySingles(puzzle, size), solution);
      assert.ok(puzzle.filter(Boolean).length <= maxGivens, 'too many givens');
      for (const unit of layout(size).units) {
        assert.equal(new Set(unit.cells.map((cell) => solution[cell])).size, size);
      }
    }
  });
}
