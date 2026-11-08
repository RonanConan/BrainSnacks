import test from 'node:test';
import assert from 'node:assert/strict';
import { riddles, isCorrect } from '../js/data/riddles.js';
import { makeArithmetic } from '../js/games/maths.js';
import { load, save, remove } from '../js/core/storage.js';
import { makeRng } from '../js/core/random.js';

test('riddle answers can end in punctuation', () => {
  const piano = riddles.find((riddle) => riddle.answers[0] === 'A piano');
  for (const guess of ['A piano.', 'piano...', 'It is a piano.', 'piano?']) {
    assert.ok(isCorrect(piano, guess), guess);
  }
  assert.ok(!isCorrect(piano, 'A door.'));
});

test('decimals in riddle answers still match', () => {
  const ball = riddles.find((riddle) => riddle.question.includes('bat and a ball'));
  assert.ok(isCorrect(ball, '0.05'));
  assert.ok(isCorrect(ball, '0.05.'));
  assert.ok(isCorrect(ball, '5p.'));
});

test('arithmetic hints never describe an empty step', () => {
  const rng = makeRng(29);
  for (const level of ['gentle', 'medium', 'tricky']) {
    for (let i = 0; i < 5000; i++) {
      const { prompt, hints } = makeArithmetic(level, rng);
      for (const hint of hints) {
        assert.ok(!/takes 0\b|halve 0\b/.test(hint), `${prompt}: ${hint}`);
      }
    }
  }
});

function withStorage(store, run) {
  const before = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: store, configurable: true });
  try {
    run();
  } finally {
    if (before) Object.defineProperty(globalThis, 'localStorage', before);
    else delete globalThis.localStorage;
  }
}

test('values survive for the visit when the browser refuses to store them', () => {
  const store = {
    getItem: () => '"old value"',
    setItem: () => { throw new Error('quota'); },
    removeItem: () => {},
  };
  withStorage(store, () => {
    save('full', 'new value');
    assert.equal(load('full'), 'new value');
    remove('full');
  });
});

test('a later successful save replaces the in-memory copy', () => {
  const data = new Map();
  let failing = true;
  const store = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      if (failing) throw new Error('quota');
      data.set(key, value);
    },
    removeItem: (key) => data.delete(key),
  };
  withStorage(store, () => {
    save('flaky', 1);
    failing = false;
    save('flaky', 2);
    data.set('flaky', '3');
    assert.equal(load('flaky'), 3);
    remove('flaky');
  });
});
