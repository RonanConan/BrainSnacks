import { h } from '../core/dom.js';
import { pick, randInt, shuffle } from '../core/random.js';

const OP = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => a / b };
const OP_LIST = ['+', '−', '×', '÷'];

// Applies × and ÷ first, then + and −, left to right.
export function evaluate(numbers, ops) {
  const values = [numbers[0]];
  const rest = [];
  ops.forEach((op, i) => {
    if (op === '×' || op === '÷') values[values.length - 1] = OP[op](values[values.length - 1], numbers[i + 1]);
    else {
      rest.push(op);
      values.push(numbers[i + 1]);
    }
  });
  return rest.reduce((total, op, i) => OP[op](total, values[i + 1]), values[0]);
}

function typed(prompt, answer, hints, working) {
  return { kind: 'typed', prompt, answer, hints, working };
}

const addHints = (a, b) => {
  const tens = Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10;
  return ['Add the tens first, then the ones.', `The tens make ${tens}. Now add ${a % 10} and ${b % 10}.`];
};

export function makeArithmetic(level, rng = Math.random) {
  const kinds = {
    gentle: ['add', 'subtract', 'times'],
    medium: ['bigTimes', 'mix', 'half'],
    tricky: ['percent', 'square', 'bracket'],
  }[level];
  const kind = pick(kinds, rng);
  if (kind === 'add') {
    const a = randInt(12, 68, rng);
    const b = randInt(11, 29, rng);
    return typed(`${a} + ${b}`, a + b, addHints(a, b), `${a} + ${b} = ${a + b}`);
  }
  if (kind === 'subtract') {
    const b = randInt(11, 39, rng);
    const a = b + randInt(12, 55, rng);
    const up = Math.ceil(b / 10) * 10;
    return typed(`${a} − ${b}`, a - b,
      ['Try counting up from the smaller number instead.', `Going from ${b} up to ${up} takes ${up - b}. How far is it from there to ${a}?`],
      `${a} − ${b} = ${a - b}`);
  }
  if (kind === 'times') {
    const a = randInt(3, 9, rng);
    const b = randInt(3, 10, rng);
    return typed(`${a} × ${b}`, a * b,
      ['Split one number into easier parts.', `${a} × ${b - 1} is ${a * (b - 1)}. Add one more ${a}.`],
      `${a} × ${b} = ${a * b}`);
  }
  if (kind === 'bigTimes') {
    const a = randInt(12, 19, rng);
    const b = randInt(3, 9, rng);
    return typed(`${a} × ${b}`, a * b,
      [`Split ${a} into 10 and ${a - 10}.`, `10 × ${b} is ${10 * b}, and ${a - 10} × ${b} is ${(a - 10) * b}.`],
      `${10 * b} + ${(a - 10) * b} = ${a * b}`);
  }
  if (kind === 'mix') {
    const a = randInt(5, 30, rng);
    const b = randInt(3, 9, rng);
    const c = randInt(3, 9, rng);
    return typed(`${a} + ${b} × ${c}`, a + b * c,
      ['Multiplying comes before adding.', `${b} × ${c} is ${b * c}.`],
      `${b} × ${c} = ${b * c}, and ${a} + ${b * c} = ${a + b * c}`);
  }
  if (kind === 'half') {
    const n = randInt(26, 99, rng) * 2;
    const tens = Math.floor(n / 100) * 100 + Math.floor((n % 100) / 10) * 10;
    return typed(`Half of ${n}`, n / 2,
      ['Halve it in two parts.', `Half of ${tens} is ${tens / 2}. Now halve ${n - tens}.`],
      `Half of ${n} = ${n / 2}`);
  }
  if (kind === 'percent') {
    const percent = pick([10, 20, 25, 50, 75], rng);
    const n = randInt(2, 24, rng) * 20;
    const answer = (n * percent) / 100;
    const hint = { 10: 'Divide by 10.', 20: 'Find 10%, then double it.', 25: 'Find a half, then halve it again.', 50: 'Just halve it.', 75: 'Find 25%, then take three of those.' }[percent];
    return typed(`${percent}% of ${n}`, answer, [hint, `10% of ${n} is ${n / 10}.`], `${percent}% of ${n} = ${answer}`);
  }
  if (kind === 'square') {
    const a = randInt(11, 16, rng);
    return typed(`${a}²`, a * a,
      [`That means ${a} × ${a}.`, `10 × ${a} is ${10 * a}, and ${a - 10} × ${a} is ${(a - 10) * a}.`],
      `${10 * a} + ${(a - 10) * a} = ${a * a}`);
  }
  const a = randInt(4, 15, rng);
  const b = randInt(3, 12, rng);
  const c = randInt(3, 6, rng);
  const d = randInt(2, 15, rng);
  const result = (a + b) * c - d;
  return typed(`(${a} + ${b}) × ${c} − ${d}`, result,
    ['Do the brackets first.', `${a} + ${b} is ${a + b}, and that times ${c} is ${(a + b) * c}.`],
    `${a + b} × ${c} = ${(a + b) * c}, and ${(a + b) * c} − ${d} = ${result}`);
}

export function makeSequence(level, rng = Math.random) {
  const kinds = {
    gentle: ['add', 'double'],
    medium: ['add', 'multiply', 'alternate'],
    tricky: ['squares', 'fibonacci', 'growing'],
  }[level];
  const kind = pick(kinds, rng);
  const show = (list) => `${list.join(', ')}, ?`;
  if (kind === 'add') {
    const start = randInt(1, 20, rng);
    const step = randInt(level === 'gentle' ? 2 : 6, level === 'gentle' ? 9 : 17, rng);
    const list = Array.from({ length: 5 }, (_, i) => start + i * step);
    const answer = start + 5 * step;
    return typed(show(list), answer, ['Look at the gap between neighbouring numbers.', `Each number goes up by ${step}.`], `${list[4]} + ${step} = ${answer}`);
  }
  if (kind === 'double' || kind === 'multiply') {
    const ratio = kind === 'double' ? 2 : pick([3, 4], rng);
    const start = randInt(1, kind === 'double' ? 7 : 4, rng);
    const list = Array.from({ length: 4 }, (_, i) => start * ratio ** i);
    const answer = list[3] * ratio;
    return typed(show(list), answer, ['The gaps keep growing. Try dividing neighbours.', `Each number is ${ratio} times the one before.`], `${list[3]} × ${ratio} = ${answer}`);
  }
  if (kind === 'alternate') {
    const up = randInt(5, 12, rng);
    const down = randInt(1, up - 2, rng);
    const list = [randInt(5, 25, rng)];
    for (let i = 1; i < 6; i++) list.push(list[i - 1] + (i % 2 ? up : -down));
    const answer = list[5] - down;
    return typed(show(list), answer, ['The pattern takes turns. Look at every step.', `It goes up ${up}, then down ${down}, and repeats.`], `${list[5]} − ${down} = ${answer}`);
  }
  if (kind === 'squares') {
    const start = randInt(2, 6, rng);
    const list = Array.from({ length: 5 }, (_, i) => (start + i) ** 2);
    const answer = (start + 5) ** 2;
    return typed(show(list), answer, ['Each one is a number multiplied by itself.', `${list[4]} is ${start + 4} × ${start + 4}.`], `${start + 5} × ${start + 5} = ${answer}`);
  }
  if (kind === 'fibonacci') {
    const list = [randInt(1, 6, rng), randInt(2, 8, rng)];
    while (list.length < 6) list.push(list[list.length - 1] + list[list.length - 2]);
    const answer = list[4] + list[5];
    return typed(show(list), answer, ['Each number comes from the two before it.', `${list[3]} + ${list[4]} = ${list[5]}.`], `${list[4]} + ${list[5]} = ${answer}`);
  }
  const start = randInt(1, 10, rng);
  const first = randInt(2, 5, rng);
  const list = [start];
  for (let i = 0; i < 5; i++) list.push(list[i] + first + i);
  const answer = list[5] + first + 5;
  return typed(show(list), answer, ['Write out the gaps. Do they have a pattern?', 'Each gap is one bigger than the last.'], `${list[5]} + ${first + 5} = ${answer}`);
}

export function makeOperators(level, rng = Math.random) {
  const slots = level === 'gentle' ? 2 : 3;
  const allowed = level === 'gentle' ? ['+', '−', '×'] : OP_LIST;
  for (;;) {
    const numbers = Array.from({ length: slots + 1 }, () => randInt(2, level === 'tricky' ? 12 : 9, rng));
    const ops = Array.from({ length: slots }, () => pick(allowed, rng));
    let tidy = true;
    ops.forEach((op, i) => {
      if (op === '÷' && (numbers[i] % numbers[i + 1] !== 0 || numbers[i] === numbers[i + 1])) tidy = false;
    });
    const target = evaluate(numbers, ops);
    if (!tidy || !Number.isInteger(target) || target < 1 || target > 150) continue;
    if (new Set(ops).size < 2) continue;
    return {
      kind: 'ops',
      numbers,
      ops,
      target,
      hints: ops.map((op, i) => `Gap ${i + 1} can be ${op}.`),
      working: numbers.map((n, i) => (i < ops.length ? `${n} ${ops[i]} ` : n)).join('') + ` = ${target}`,
    };
  }
}

export function makeTarget(level, rng = Math.random) {
  const count = { gentle: 3, medium: 4, tricky: 5 }[level];
  for (;;) {
    const numbers = Array.from({ length: count }, () => randInt(2, 12, rng));
    const pool = [...numbers];
    const steps = [];
    let ok = true;
    while (pool.length > 1 && ok) {
      const list = shuffle(pool, rng);
      let [a, b] = list;
      if (b > a) [a, b] = [b, a];
      const options = [];
      options.push('+');
      if (a > b) options.push('−');
      if (a * b <= 150 && b > 1) options.push('×');
      if (b > 1 && a % b === 0 && a !== b) options.push('÷');
      const op = pick(options, rng);
      const result = OP[op](a, b);
      if (!Number.isInteger(result) || result <= 0) {
        ok = false;
        break;
      }
      steps.push([a, op, b, result]);
      pool.splice(pool.indexOf(a), 1);
      pool.splice(pool.indexOf(b), 1);
      pool.push(result);
    }
    const target = pool[0];
    if (!ok || numbers.includes(target) || target < 10 || target > 150) continue;
    return {
      kind: 'target',
      numbers,
      target,
      steps,
      hints: ['Try working backwards from the target. What could make it?',
        ...steps.map(([a, op, b, result]) => `Try ${a} ${op} ${b}, which makes ${result}.`)],
      working: steps.map(([a, op, b, result]) => `${a} ${op} ${b} = ${result}`).join(', then '),
    };
  }
}

export function makeRound(level, rng = Math.random) {
  return shuffle([
    makeArithmetic(level, rng),
    makeSequence(level, rng),
    makeOperators(level, rng),
    makeTarget(level, rng),
    pick([makeArithmetic, makeSequence], rng)(level, rng),
  ], rng);
}

function mount(el, ctx, saved) {
  const state = saved ?? {
    questions: makeRound(ctx.level),
    index: 0,
    answered: false,
    hintStep: 0,
    picks: [],
    tiles: null,
    history: [],
  };

  const dots = h('div', { class: 'dots', 'aria-hidden': 'true' });
  const body = h('div', { class: 'maths-body' });
  el.append(h('div', { class: 'maths' }, dots, body));

  let keyHandler = null;
  const clearKeys = () => {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  };

  const current = () => state.questions[state.index];

  function paintDots() {
    dots.replaceChildren(...state.questions.map((_, i) =>
      h('span', { class: `dot${i < state.index || (i === state.index && state.answered) ? ' dot-done' : ''}${i === state.index ? ' dot-now' : ''}` }),
    ));
  }

  function completed(revealed) {
    state.answered = true;
    ctx.setActionsEnabled(false);
    ctx.save();
    const last = state.index === state.questions.length - 1;
    if (last) {
      paintDots();
      show();
      ctx.setActionsEnabled(true);
      ctx.finish({ revealed, message: revealed ? 'That was the last one. Fancy another round?' : 'Five out of five done. Lovely sums.' });
      return;
    }
    show(revealed);
  }

  function nextQuestion() {
    state.index += 1;
    state.answered = false;
    state.hintStep = 0;
    state.picks = [];
    state.tiles = null;
    state.history = [];
    ctx.setActionsEnabled(true);
    ctx.say('Next one.', 'idle');
    ctx.save();
    show();
  }

  function workingNote(question) {
    return h('p', { class: 'working' }, question.kind === 'target' ? `One way: ${question.working}.` : question.working);
  }

  function nextRow() {
    if (state.index === state.questions.length - 1) return '';
    const button = h('button', { class: 'btn btn-main', type: 'button', onClick: nextQuestion }, 'Next');
    queueMicrotask(() => button.focus());
    return button;
  }

  function showTyped(question) {
    if (state.answered) {
      body.append(
        h('p', { class: 'maths-prompt' }, question.prompt.replace('?', String(question.answer))),
        workingNote(question),
        nextRow(),
      );
      return;
    }
    const input = h('input', {
      class: 'maths-input',
      type: 'text',
      inputmode: 'numeric',
      autocomplete: 'off',
      'aria-label': 'Your answer',
      'data-shortcuts': 'on',
      onInput: () => { input.value = input.value.replace(/[^0-9-]/g, ''); },
    });
    const check = () => {
      if (input.value === '') return;
      if (Number(input.value) === question.answer) {
        ctx.say('Yes!', 'happy');
        completed(false);
      } else {
        ctx.say('Not quite. Have another go, or ask for a hint.', 'think');
        input.select();
      }
    };
    body.append(
      h('p', { class: 'maths-prompt' }, question.prompt),
      h('form', {
        class: 'maths-form',
        onSubmit: (event) => { event.preventDefault(); check(); },
      }, input, h('button', { class: 'btn btn-main', type: 'submit' }, 'Check')),
    );
    input.focus();
  }

  function showOps(question) {
    if (state.answered) {
      body.append(h('p', { class: 'maths-prompt' }, question.working), nextRow());
      return;
    }
    if (state.picks.length === 0) state.picks = question.ops.map(() => null);
    const gaps = question.numbers.slice(0, -1).map((_, i) =>
      h('button', {
        class: 'gap',
        type: 'button',
        'aria-label': `Gap ${i + 1}`,
        onClick: () => cycle(i),
        onKeydown: (event) => {
          const map = { '+': '+', '-': '−', '*': '×', x: '×', '/': '÷' };
          if (map[event.key]) {
            event.preventDefault();
            setGap(i, map[event.key]);
          }
        },
      }, state.picks[i] || '?'),
    );
    function setGap(i, op) {
      state.picks[i] = op;
      gaps[i].textContent = op;
      ctx.save();
    }
    function cycle(i) {
      const at = OP_LIST.indexOf(state.picks[i]);
      setGap(i, OP_LIST[(at + 1) % OP_LIST.length]);
    }
    const check = () => {
      if (state.picks.some((op) => !op)) {
        ctx.say('Fill in every gap first.', 'think');
        return;
      }
      const value = evaluate(question.numbers, state.picks);
      if (Math.abs(value - question.target) < 1e-9) {
        ctx.say('Yes!', 'happy');
        completed(false);
      } else {
        ctx.say(`That makes ${Number.isInteger(value) ? value : value.toFixed(2)}, not ${question.target}. Remember, × and ÷ go first.`, 'think');
      }
    };
    const parts = [];
    question.numbers.forEach((n, i) => {
      parts.push(h('span', { class: 'gap-number' }, String(n)));
      if (i < gaps.length) parts.push(gaps[i]);
    });
    body.append(
      h('p', { class: 'maths-label' }, 'Click the gaps to choose the signs.'),
      h('div', { class: 'gap-row' }, parts, h('span', { class: 'gap-number' }, `= ${question.target}`)),
      h('button', { class: 'btn btn-main maths-check', type: 'button', onClick: check }, 'Check'),
    );
  }

  function showTarget(question) {
    if (state.answered) {
      body.append(h('p', { class: 'maths-label' }, `Target: ${question.target}`), workingNote(question), nextRow());
      return;
    }
    if (!state.tiles) {
      state.tiles = question.numbers.map((value, id) => ({ id, value, used: false }));
      state.history = [];
    }
    let first = null;
    let op = null;
    const tileRow = h('div', { class: 'tiles' });
    const opRow = h('div', { class: 'tile-ops' }, OP_LIST.map((symbol) =>
      h('button', { class: 'tile-op', type: 'button', 'aria-pressed': 'false', onClick: () => chooseOp(symbol) }, symbol),
    ));
    const line = h('p', { class: 'maths-line' });

    function paint() {
      tileRow.replaceChildren(...state.tiles.filter((tile) => !tile.used).map((tile) =>
        h('button', {
          class: `tile${first && first.id === tile.id ? ' tile-on' : ''}`,
          type: 'button',
          onClick: () => chooseTile(tile),
        }, String(tile.value)),
      ));
      opRow.querySelectorAll('.tile-op').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.textContent === op));
      });
      line.textContent = first ? `${first.value} ${op || ''}` : 'Click a number to begin.';
    }

    function chooseOp(symbol) {
      if (!first) {
        ctx.say('Pick a number first.', 'think');
        return;
      }
      op = symbol;
      paint();
    }

    function chooseTile(tile) {
      if (!first || !op || first.id === tile.id) {
        first = first && first.id === tile.id ? null : tile;
        op = null;
        paint();
        return;
      }
      const result = OP[op](first.value, tile.value);
      if (!Number.isInteger(result) || result < 0) {
        ctx.say('Stick to whole numbers that are not negative. Try another pair.', 'think');
        return;
      }
      state.history.push({ a: first.id, b: tile.id, made: state.tiles.length });
      first.used = true;
      tile.used = true;
      state.tiles.push({ id: state.tiles.length, value: result, used: false });
      first = null;
      op = null;
      ctx.save();
      if (result === question.target) {
        ctx.say('Yes!', 'happy');
        completed(false);
        return;
      }
      paint();
    }

    function undo() {
      const last = state.history.pop();
      if (!last) return;
      state.tiles.splice(last.made, 1);
      state.tiles[last.a].used = false;
      state.tiles[last.b].used = false;
      first = null;
      op = null;
      ctx.save();
      paint();
    }

    function restart() {
      while (state.history.length) undo();
    }

    body.append(
      h('p', { class: 'maths-label' }, 'Combine the numbers to reach'),
      h('p', { class: 'maths-target' }, String(question.target)),
      tileRow,
      opRow,
      line,
      h('div', { class: 'tile-actions' },
        h('button', { class: 'btn', type: 'button', onClick: undo }, 'Undo'),
        h('button', { class: 'btn', type: 'button', onClick: restart }, 'Start over'),
      ),
    );
    paint();
  }

  function show() {
    clearKeys();
    body.replaceChildren();
    paintDots();
    const question = current();
    if (question.kind === 'typed') showTyped(question);
    if (question.kind === 'ops') showOps(question);
    if (question.kind === 'target') showTarget(question);
  }

  if (state.answered) ctx.setActionsEnabled(false);
  show();

  return {
    serialize: () => state,
    hasProgress: () => state.index > 0 || state.answered || state.history.length > 0,
    destroy: clearKeys,
    hint() {
      if (state.answered) return;
      const question = current();
      const text = question.hints[state.hintStep];
      if (text) {
        state.hintStep += 1;
        ctx.say(text, 'think');
      } else {
        ctx.say("That's every hint for this one. Show the answer if you'd like it.", 'idle');
      }
    },
    reveal() {
      if (state.answered) return;
      const question = current();
      ctx.say(question.kind === 'typed' ? `The answer is ${question.answer}.` : 'Here is one way to do it.', 'idle');
      completed(true);
    },
  };
}

export default {
  id: 'maths',
  title: 'Maths',
  blurb: 'Five quick sums and number puzzles.',
  intro: 'Five little puzzles in a row. Take your time, nobody is counting.',
  levelName: 'Difficulty',
  levels: [
    { id: 'gentle', label: 'Gentle' },
    { id: 'medium', label: 'Medium' },
    { id: 'tricky', label: 'Tricky' },
  ],
  newLabel: 'New round',
  nextLabel: 'Another round',
  mount,
};
