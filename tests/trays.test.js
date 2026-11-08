import test from 'node:test';
import assert from 'node:assert/strict';
import { TRAYS, trayForRoute, neighbour, isForward } from '../js/trays.js';
import { games } from '../js/games/index.js';

const [puzzles, arcade] = TRAYS;

test('routes pick the right tray, and unknown ones land on the first page', () => {
  assert.equal(trayForRoute(''), puzzles);
  assert.equal(trayForRoute('arcade'), arcade);
  assert.equal(trayForRoute('no-such-page'), puzzles);
});

test('neighbours stop at the ends of the book', () => {
  assert.equal(neighbour(puzzles, 1), arcade);
  assert.equal(neighbour(arcade, -1), puzzles);
  assert.equal(neighbour(puzzles, -1), null);
  assert.equal(neighbour(arcade, 1), null);
});

test('turning direction follows the order of the trays', () => {
  assert.equal(isForward(puzzles, arcade), true);
  assert.equal(isForward(arcade, puzzles), false);
});

test('no game shares a route with a tray', () => {
  const trayRoutes = TRAYS.map((tray) => tray.hash);
  for (const game of games) assert.ok(!trayRoutes.includes(`#/${game.id}`), game.id);
});
