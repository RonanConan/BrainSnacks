import { h } from '../core/dom.js';
import { drawFromBag } from '../core/bag.js';
import { riddles, isCorrect } from '../data/riddles.js';

function pool(level) {
  return riddles.map((riddle, i) => (level === 'all' || riddle.kind === level ? i : -1)).filter((i) => i >= 0);
}

function mount(el, ctx, saved) {
  const state = saved ?? { index: drawFromBag(`riddles.${ctx.level}`, pool(ctx.level)), hintStep: 0, shown: false };
  const riddle = riddles[state.index];
  let finished = false;

  const input = h('input', {
    class: 'rd-input',
    type: 'text',
    autocomplete: 'off',
    'aria-label': 'Your answer',
    placeholder: 'Your answer',
  });
  const submit = h('button', { class: 'btn btn-main', type: 'submit' }, 'Check');
  const answerBox = h('div', { class: 'rd-answer', hidden: true });

  el.append(
    h('div', { class: 'rd' },
      h('p', { class: 'rd-question' }, riddle.question),
      h('form', {
        class: 'rd-form',
        onSubmit: (event) => {
          event.preventDefault();
          check();
        },
      }, input, submit),
      answerBox,
    ),
  );

  function showAnswer() {
    input.disabled = true;
    submit.disabled = true;
    answerBox.hidden = false;
    answerBox.replaceChildren(
      h('p', { class: 'rd-solution' }, riddle.answers[0]),
      h('p', null, riddle.why),
    );
  }

  function check() {
    if (finished || !input.value.trim()) return;
    if (isCorrect(riddle, input.value)) {
      finished = true;
      showAnswer();
      ctx.finish();
    } else {
      ctx.say("Not that, I don't think. Have another go, or ask me for a hint.", 'think');
      input.select();
    }
  }

  input.focus();

  return {
    serialize: () => state,
    hasProgress: () => false,
    hint() {
      if (finished) return;
      const text = riddle.hints[state.hintStep];
      if (text) {
        state.hintStep += 1;
        ctx.say(text, 'think');
      } else {
        ctx.say(`${riddle.hints[riddle.hints.length - 1]} That's all my hints for this one.`, 'idle');
      }
    },
    reveal() {
      finished = true;
      showAnswer();
      ctx.finish({ revealed: true });
    },
  };
}

export default {
  id: 'riddles',
  title: 'Riddles and logic',
  blurb: 'Short teasers that play tricks on you.',
  intro: 'Type your answer in a word or two. Read carefully, some of these are sneaky.',
  levelName: 'Type',
  levels: [
    { id: 'all', label: 'Both' },
    { id: 'riddle', label: 'Riddles' },
    { id: 'logic', label: 'Logic' },
  ],
  typing: true,
  newLabel: 'Skip this one',
  nextLabel: 'Next one',
  mount,
};
