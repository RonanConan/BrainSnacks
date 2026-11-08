import { h } from '../core/dom.js';
import { sample, shuffle } from '../core/random.js';
import { drawFromBag } from '../core/bag.js';
import { capitals, capitalNotes } from '../data/capitals.js';
import { questions } from '../data/quiz.js';

export function poolFor(level) {
  const ids = [];
  if (level === 'all' || level === 'capitals') {
    capitals.forEach((_, i) => ids.push(`c${i}`));
  }
  if (level !== 'capitals') {
    questions.forEach((question, i) => {
      if (level === 'all' || question[0] === level) ids.push(`q${i}`);
    });
  }
  return ids;
}

export function buildQuestion(id, rng = Math.random) {
  const index = Number(id.slice(1));
  if (id[0] === 'c') {
    const [country, city, continent] = capitals[index];
    const neighbours = capitals.filter((row) => row[2] === continent && row[1] !== city).map((row) => row[1]);
    const note = capitalNotes[country];
    return {
      id,
      text: `What is the capital of ${country}?`,
      answer: city,
      options: shuffle([city, ...sample(neighbours, 3, rng)], rng),
      clue: `The name starts with ${city[0]} and has ${city.replace(/[^\p{L}]/gu, '').length} letters.`,
      fact: note || `${city} is the capital of ${country}.`,
    };
  }
  const [, text, answer, wrong, clue, fact] = questions[index];
  return { id, text, answer, options: shuffle([answer, ...wrong], rng), clue, fact };
}

function mount(el, ctx, saved) {
  const state = saved ?? {
    question: buildQuestion(drawFromBag(`quiz.${ctx.level}`, poolFor(ctx.level))),
    wrong: [],
    removed: [],
    hintStep: 0,
  };
  const { question } = state;
  let finished = false;

  const optionEls = question.options.map((option, index) =>
    h('button', { class: 'option', type: 'button', onClick: () => choose(option) },
      h('span', { class: 'option-key' }, String(index + 1)),
      h('span', null, option),
    ),
  );

  el.append(
    h('div', { class: 'quiz' },
      h('h2', { class: 'quiz-question' }, question.text),
      h('div', { class: 'options' }, optionEls),
    ),
  );

  function paint(showAnswer = false) {
    question.options.forEach((option, index) => {
      const node = optionEls[index];
      const isGone = state.wrong.includes(option) || state.removed.includes(option);
      node.classList.toggle('option-wrong', state.wrong.includes(option));
      node.classList.toggle('option-gone', state.removed.includes(option));
      node.classList.toggle('option-right', showAnswer && option === question.answer);
      node.disabled = finished;
      node.setAttribute('aria-disabled', String(isGone));
      node.tabIndex = isGone ? -1 : 0;
    });
  }

  function choose(option) {
    if (finished || state.wrong.includes(option) || state.removed.includes(option)) return;
    if (option === question.answer) {
      finished = true;
      paint(true);
      ctx.finish({ message: `Yes, ${question.answer}! ${question.fact}` });
      return;
    }
    state.wrong.push(option);
    paint();
    ctx.say('Not that one. Have another go, or ask me for a hint.', 'think');
    ctx.save();
  }

  function onKey(event) {
    const index = Number(event.key) - 1;
    if (index >= 0 && index < question.options.length && !event.ctrlKey && !event.metaKey) {
      choose(question.options[index]);
    }
  }

  document.addEventListener('keydown', onKey);
  paint();

  return {
    serialize: () => state,
    hasProgress: () => false,
    destroy: () => document.removeEventListener('keydown', onKey),
    hint() {
      if (finished) return;
      if (state.hintStep === 0) {
        state.hintStep = 1;
        ctx.say(question.clue, 'think');
        return;
      }
      if (state.hintStep === 1) {
        state.hintStep = 2;
        const left = question.options.filter((option) => option !== question.answer && !state.wrong.includes(option));
        const removing = left.slice(0, Math.max(0, left.length - 1));
        state.removed.push(...removing);
        paint();
        ctx.say(removing.length ? "I've taken away some options it can't be." : "It's one of the two that are left.", 'think');
        return;
      }
      ctx.say(`${question.clue} That's all I've got. Show the answer if you'd like it.`, 'idle');
    },
    reveal() {
      finished = true;
      paint(true);
      ctx.finish({ revealed: true, message: `It's ${question.answer}. ${question.fact}` });
    },
  };
}

export default {
  id: 'quiz',
  title: 'Quick quiz',
  blurb: 'One random question at a time.',
  intro: 'Pick an answer by clicking it or pressing 1 to 4. Wrong guesses cost nothing.',
  levelName: 'Topic',
  levels: [
    { id: 'all', label: 'Everything' },
    { id: 'capitals', label: 'Capitals' },
    { id: 'science', label: 'Nature and science' },
    { id: 'history', label: 'History' },
    { id: 'world', label: 'The world' },
    { id: 'food', label: 'Food' },
    { id: 'arts', label: 'Books and arts' },
  ],
  newLabel: 'Skip this one',
  nextLabel: 'Next question',
  mount,
};
