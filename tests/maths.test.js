import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, makeArithmetic, makeOperators, makeSequence, makeTarget, makeRound } from '../js/games/maths.js';
import { makeRng } from '../js/core/random.js';

const LEVELS = ['gentle', 'medium', 'tricky'];
const OPS = {
  '+': (a, b) => a + b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
};

function canReach(numbers, target) {
  if (numbers.includes(target)) return true;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i === j) continue;
      const rest = numbers.filter((_, k) => k !== i && k !== j);
      for (const op of Object.values(OPS)) {
        const value = op(numbers[i], numbers[j]);
        if (Number.isInteger(value) && value >= 0 && canReach([...rest, value], target)) return true;
      }
    }
  }
  return false;
}

// Reads the plain prompts ("12 + 7", "(4 + 5) × 3 − 2", "Half of 80", "20% of 60", "12²").
function computeArithmetic(prompt) {
  let match = prompt.match(/^Half of (\d+)$/);
  if (match) return Number(match[1]) / 2;
  match = prompt.match(/^(\d+)% of (\d+)$/);
  if (match) return (Number(match[1]) * Number(match[2])) / 100;
  match = prompt.match(/^(\d+)²$/);
  if (match) return Number(match[1]) ** 2;
  const js = prompt.replaceAll('×', '*').replaceAll('−', '-');
  assert.match(js, /^[\d\s+*()-]+$/);
  return Function(`return ${js}`)();
}

for (const level of LEVELS) {
  test(`${level}: arithmetic answers are correct whole numbers`, () => {
    const rng = makeRng(11);
    for (let i = 0; i < 2000; i++) {
      const q = makeArithmetic(level, rng);
      assert.equal(computeArithmetic(q.prompt), q.answer, q.prompt);
      assert.ok(Number.isInteger(q.answer) && q.answer > 0, q.prompt);
      assert.equal(q.hints.length, 2);
    }
  });

  test(`${level}: sequences continue their stated pattern`, () => {
    const rng = makeRng(13);
    for (let i = 0; i < 2000; i++) {
      const q = makeSequence(level, rng);
      assert.ok(Number.isInteger(q.answer), q.prompt);
      assert.ok(q.prompt.endsWith(', ?'), q.prompt);
      const shown = q.prompt.slice(0, -3).split(', ').map(Number);
      assert.ok(shown.every(Number.isInteger), q.prompt);
      assert.ok(q.working.endsWith(`= ${q.answer}`), `${q.prompt} ${q.working}`);
    }
  });

  test(`${level}: operator puzzles evaluate to their target`, () => {
    const rng = makeRng(17);
    for (let i = 0; i < 2000; i++) {
      const q = makeOperators(level, rng);
      assert.equal(evaluate(q.numbers, q.ops), q.target);
      assert.ok(Number.isInteger(q.target) && q.target >= 1 && q.target <= 150);
      assert.equal(q.numbers.length, q.ops.length + 1);
    }
  });

  test(`${level}: every target can be reached and the stored steps work`, () => {
    const rng = makeRng(19);
    for (let i = 0; i < 300; i++) {
      const q = makeTarget(level, rng);
      const pool = [...q.numbers];
      for (const [a, op, b, result] of q.steps) {
        assert.equal(OPS[op](a, b), result);
        assert.ok(pool.includes(a) && pool.includes(b));
        pool.splice(pool.indexOf(a), 1);
        pool.splice(pool.indexOf(b), 1);
        pool.push(result);
      }
      assert.deepEqual(pool, [q.target]);
      assert.ok(canReach(q.numbers, q.target));
      assert.ok(!q.numbers.includes(q.target));
    }
  });
}

test('rounds have five questions and survive a save', () => {
  const round = makeRound('gentle', makeRng(23));
  assert.equal(round.length, 5);
  assert.deepEqual(JSON.parse(JSON.stringify(round)), round);
});

test('evaluate does multiplication before addition', () => {
  assert.equal(evaluate([2, 3, 4], ['+', '×']), 14);
  assert.equal(evaluate([12, 3, 1], ['÷', '−']), 3);
});
