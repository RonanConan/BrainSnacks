import test from 'node:test';
import assert from 'node:assert/strict';
import { questions } from '../js/data/quiz.js';
import { capitals, capitalNotes } from '../js/data/capitals.js';
import { buildQuestion, poolFor } from '../js/games/quiz.js';
import { makeRng } from '../js/core/random.js';
import { drawFromBag } from '../js/core/bag.js';

const CATEGORIES = new Set(['science', 'history', 'world', 'food', 'arts']);

test('general questions are well formed', () => {
  const seen = new Set();
  for (const [category, text, answer, wrong, clue, fact] of questions) {
    assert.ok(CATEGORIES.has(category), `${text}: bad category`);
    assert.ok(!seen.has(text), `${text}: duplicate`);
    seen.add(text);
    assert.equal(wrong.length, 3, `${text}: needs 3 wrong answers`);
    assert.equal(new Set([answer, ...wrong]).size, 4, `${text}: answers repeat`);
    assert.ok(clue && fact, `${text}: needs clue and fact`);
  }
});

test('capitals are unique and notes match real rows', () => {
  assert.equal(new Set(capitals.map((row) => row[0])).size, capitals.length);
  assert.equal(new Set(capitals.map((row) => row[1])).size, capitals.length);
  const countries = new Set(capitals.map((row) => row[0]));
  for (const country of Object.keys(capitalNotes)) assert.ok(countries.has(country), country);
});

test('every question builds four distinct options including the answer', () => {
  const rng = makeRng(7);
  for (const id of poolFor('all')) {
    const built = buildQuestion(id, rng);
    assert.equal(built.options.length, 4, id);
    assert.equal(new Set(built.options).size, 4, id);
    assert.ok(built.options.includes(built.answer), id);
  }
});

test('every topic has questions', () => {
  for (const level of ['all', 'capitals', ...CATEGORIES]) {
    assert.ok(poolFor(level).length >= 30, level);
  }
});

test('the bag does not repeat until the pool is used up', () => {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const drawn = ids.map(() => drawFromBag('test', ids, makeRng(1)));
  assert.equal(new Set(drawn).size, ids.length);
});
