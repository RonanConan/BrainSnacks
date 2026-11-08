import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FONTS, DEFAULT_FONT } from '../js/core/font.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');
const styles = read('css/styles.css');
const gameStyles = read('css/games.css');

function ruleFor(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `${selector} is missing`);
  return css.slice(start, css.indexOf('}', start));
}

test('the page applies every font choice before it first paints', () => {
  assert.ok(FONTS.some((font) => font.id === DEFAULT_FONT));
  for (const { id } of FONTS) {
    if (id !== DEFAULT_FONT) assert.ok(html.includes(`font === '${id}'`), `${id} is not applied in index.html`);
  }
});

test('every font the picker offers is loaded', () => {
  for (const family of ['Atkinson+Hyperlegible', 'Bagel+Fat+One', 'Gaegu', 'Lexend']) {
    assert.ok(html.includes(`family=${family}`), `${family} is not loaded`);
  }
});

test('titles keep the display font', () => {
  for (const selector of ['.home h1', '.book-head h1', '.sweet-name', '.cover-plate h2']) {
    assert.ok(ruleFor(styles, selector).includes('var(--display)'), selector);
  }
});

test('puzzle text follows the font picker', () => {
  for (const selector of ['.maths-prompt', '.gap-number', '.maths-target', '.rd-question', '.rd-solution']) {
    assert.ok(ruleFor(gameStyles, selector).includes('var(--puzzle)'), selector);
  }
  assert.ok(ruleFor(gameStyles, '.tile').includes('var(--puzzle)'));
  assert.ok(ruleFor(gameStyles, '.sc-slot, .sc-tile').includes('var(--puzzle)'));
});
