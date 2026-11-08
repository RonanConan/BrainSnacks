import test from 'node:test';
import assert from 'node:assert/strict';
import { riddles, isCorrect } from '../js/data/riddles.js';
import { pictures } from '../js/data/pictures.js';
import { cluesFor, solveByLines } from '../js/games/picture.js';
import { makeDeck } from '../js/games/memory.js';
import { makeRng } from '../js/core/random.js';

test('every riddle is complete and accepts all of its own answers', () => {
  assert.equal(new Set(riddles.map((riddle) => riddle.question)).size, riddles.length);
  for (const riddle of riddles) {
    assert.ok(['riddle', 'logic'].includes(riddle.kind), riddle.question);
    assert.equal(riddle.hints.length, 2, riddle.question);
    assert.ok(riddle.why, riddle.question);
    for (const answer of riddle.answers) {
      assert.ok(isCorrect(riddle, answer), `${riddle.question} should accept ${answer}`);
    }
  }
});

test('riddle matching forgives wording but not wrong answers', () => {
  const piano = riddles.find((riddle) => riddle.answers[0] === 'A piano');
  assert.ok(isCorrect(piano, 'piano'));
  assert.ok(isCorrect(piano, 'The Piano!'));
  assert.ok(isCorrect(piano, 'I think a piano'));
  assert.ok(!isCorrect(piano, 'door'));
  assert.ok(!isCorrect(piano, ''));
  const sheep = riddles.find((riddle) => riddle.question.includes('17 sheep'));
  assert.ok(isCorrect(sheep, 'nine'));
  assert.ok(!isCorrect(sheep, '8'));
});

for (const [size, set] of Object.entries(pictures)) {
  for (const picture of set) {
    test(`${size}x${size} ${picture.name} is solvable by logic alone`, () => {
      assert.equal(picture.rows.length, Number(size));
      for (const row of picture.rows) assert.equal(row.length, Number(size), row);
      const { rowClues, colClues } = cluesFor(picture.rows);
      const solved = solveByLines(rowClues, colClues);
      const expected = picture.rows.join('').split('').map((ch) => (ch === '#' ? 1 : 0));
      assert.deepEqual(solved, expected);
    });
  }
}

test('memory decks hold exact pairs', () => {
  const rng = makeRng(3);
  for (const pairs of [6, 8, 10]) {
    const deck = makeDeck(pairs, rng);
    assert.equal(deck.length, pairs * 2);
    const counts = new Map();
    deck.forEach((icon) => counts.set(icon, (counts.get(icon) || 0) + 1));
    assert.equal(counts.size, pairs);
    assert.ok([...counts.values()].every((count) => count === 2));
  }
});
