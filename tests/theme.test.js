import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

function tokens(selector) {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS = [
  ['ink', 'page'], ['soft', 'page'], ['muted', 'page'], ['ink', 'paper'],
  ['ink', 'butter'], ['ink', 'mint'], ['ink', 'sky'], ['ink', 'pink'], ['ink', 'lilac'], ['ink', 'pale'],
  ['typed', 'cell-bg'], ['typed', 'butter'], ['typed', 'mint'], ['typed', 'related'], ['typed', 'pale'],
  ['wrong', 'wrong-soft'], ['page', 'ink'],
];

for (const [name, selector] of [['light', ':root'], ['dark', ":root[data-theme='dark']"]]) {
  test(`${name} theme text is readable on the surfaces it sits on`, () => {
    const colours = { ...tokens(':root'), ...tokens(selector) };
    for (const [text, surface] of PAIRS) {
      const ratio = contrast(colours[text], colours[surface]);
      assert.ok(ratio >= 4.5, `${text} on ${surface} is only ${ratio.toFixed(2)}:1`);
    }
  });
}
