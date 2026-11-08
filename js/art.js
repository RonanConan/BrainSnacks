// Little pictures for each compartment on the home tray.
const INK = 'var(--ink)';
const PAPER = 'var(--paper)';
const ROSE = 'var(--rose)';
const VIOLET = '#7E74E8';

function cellGrid(size, cell, draw) {
  let out = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) out += draw(r, c, c * cell, r * cell);
  }
  return out;
}

const letter = (x, y, text, size = 20, fill = INK) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-family="Bagel Fat One, sans-serif" fill="${fill}" text-anchor="middle">${text}</text>`;

const sudokuDigits = { '0,0': 5, '1,2': 3, '2,1': 8, '3,3': 1, '0,3': 7, '2,3': 2, '3,0': 4 };
const heart = ['01010', '11111', '11111', '01110', '00100'];

export const art = {
  sudoku: `<svg viewBox="0 0 164 164" aria-hidden="true"><g transform="translate(2 2)">
    ${cellGrid(4, 40, (r, c, x, y) => `<rect x="${x}" y="${y}" width="40" height="40" fill="${PAPER}" stroke="${INK}" stroke-width="1.5"/>${sudokuDigits[`${r},${c}`] ? letter(x + 20, y + 28, sudokuDigits[`${r},${c}`], 24) : ''}`)}
    <path d="M80 0v160M0 80h160" stroke="${INK}" stroke-width="5"/>
    <rect width="160" height="160" fill="none" stroke="${INK}" stroke-width="5" rx="3"/></g></svg>`,
  crossword: `<svg viewBox="0 0 150 106" aria-hidden="true">
    ${['S', 'N', 'A', 'C', 'K'].map((t, i) => `<rect x="${i * 30}" y="38" width="30" height="30" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/>${letter(i * 30 + 15, 61, t)}`).join('')}
    ${[['T', 8], ['E', 68]].map(([t, y]) => `<rect x="60" y="${y}" width="30" height="30" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/>${letter(75, y + 23, t)}`).join('')}
  </svg>`,
  quiz: `<svg viewBox="0 0 130 150" aria-hidden="true">
    <circle cx="65" cy="65" r="58" fill="${PAPER}" stroke="${INK}" stroke-width="5"/>
    <path d="M26 46c14 8 24-6 38 2s8 22 22 22 18-10 30-6M30 92c12-8 22 4 32 0" fill="none" stroke="${VIOLET}" stroke-width="9" stroke-linecap="round"/>
    ${letter(65, 90, '?', 66, INK)}
    <path d="M65 123v15M42 142h46" stroke="${INK}" stroke-width="7" stroke-linecap="round"/></svg>`,
  maths: `<svg viewBox="0 0 150 76" aria-hidden="true">
    <rect x="2" y="2" width="146" height="72" rx="14" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
    ${letter(75, 52, '7 × 8 = ?', 30)}</svg>`,
  scramble: `<svg viewBox="0 0 140 62" aria-hidden="true">
    ${[['T', -8, 6], ['A', 7, 0], ['R', -5, 8], ['T', 9, 2]].map(([t, turn, y], i) => `<g transform="translate(${i * 34 + 2} ${y}) rotate(${turn} 15 24)"><rect width="30" height="44" rx="6" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>${letter(15, 31, t, 23)}</g>`).join('')}
  </svg>`,
  riddles: `<svg viewBox="0 0 150 92" aria-hidden="true">
    <path d="M18 4h114a14 14 0 0 1 14 14v42a14 14 0 0 1-14 14H62L38 90V74H18A14 14 0 0 1 4 60V18A14 14 0 0 1 18 4z" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
    <circle cx="48" cy="39" r="7" fill="${INK}"/><circle cx="75" cy="39" r="7" fill="${INK}"/><circle cx="102" cy="39" r="7" fill="${INK}"/></svg>`,
  memory: `<svg viewBox="0 0 136 92" aria-hidden="true">
    <g transform="rotate(-7 40 46)"><rect x="12" y="8" width="56" height="76" rx="9" fill="${VIOLET}" stroke="${INK}" stroke-width="3.5"/><circle cx="40" cy="46" r="12" fill="#A9A1F4"/></g>
    <g transform="rotate(7 96 46)"><rect x="68" y="8" width="56" height="76" rx="9" fill="${PAPER}" stroke="${INK}" stroke-width="3.5"/><path d="M96 66c-20-14-20-32-9-33 5 0 9 5 9 5s4-5 9-5c11 1 11 19-9 33z" fill="${ROSE}"/></g></svg>`,
  picture: `<svg viewBox="0 0 124 124" aria-hidden="true"><g transform="translate(2 2)">
    ${cellGrid(5, 24, (r, c, x, y) => `<rect x="${x}" y="${y}" width="24" height="24" fill="${heart[r][c] === '1' ? ROSE : PAPER}" stroke="${INK}" stroke-width="2"/>`)}</g></svg>`,
};
