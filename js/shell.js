// The frame every game sits in: level picker, Berry's speech bubble, Hint, Answer, New.
import { h } from './core/dom.js';
import { load, save, remove } from './core/storage.js';
import { recordFinish } from './core/stats.js';
import { berrySvg } from './mascot.js';

const CHEERS = ['You got it!', 'Lovely work.', 'Solved!', 'That was all you.', 'Nicely done.'];
const CRUMB_COLOURS = ['#F4A6B8', '#FCE08A', '#B9DCF2', '#BDE6D3', '#D6C8F4'];

function dropCrumbs(host) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 18; i++) {
    const crumb = h('span', { class: 'crumb' });
    crumb.style.setProperty('--x', `${Math.round(Math.random() * 240 - 120)}px`);
    crumb.style.setProperty('--y', `${Math.round(Math.random() * 90 + 60)}px`);
    crumb.style.setProperty('--turn', `${Math.round(Math.random() * 360)}deg`);
    crumb.style.background = CRUMB_COLOURS[i % CRUMB_COLOURS.length];
    crumb.addEventListener('animationend', () => crumb.remove());
    host.append(crumb);
  }
}

export function openGame(game, root) {
  const key = `bs.game.${game.id}`;
  const levels = game.levels || [];
  const saved = load(key);
  const levelIds = levels.map((level) => level.id);
  let level = levelIds.includes(saved?.level)
    ? saved.level
    : game.defaultLevel ?? levelIds[0] ?? null;

  let instance = null;
  let done = false;
  let actionsOn = true;
  let asking = false;

  const stage = h('section', { class: 'stage', 'aria-label': game.title });
  const bubble = h('p', { class: 'bubble', 'aria-live': 'polite' });
  const berryHost = h('div', { class: 'berry-host', html: berrySvg });
  const berry = berryHost.firstElementChild;
  const tools = h('div', { class: 'tools' });
  const hintLabel = game.typing ? 'Give me a hint' : 'Give me a hint (H)';
  const newLabel = game.newLabel || 'New puzzle';

  const hintBtn = h('button', { class: 'btn btn-main', type: 'button', onClick: doHint }, hintLabel);
  const answerBtn = h('button', { class: 'btn', type: 'button', onClick: askAnswer }, 'Show the answer');
  const newBtn = h('button', { class: 'btn', type: 'button', onClick: askNew }, newLabel);
  const buttons = h('div', { class: 'action-buttons' }, hintBtn, answerBtn, newBtn);
  const confirmBox = h('div', { class: 'confirm', hidden: true });
  const actions = h('div', { class: 'actions' }, tools, buttons, confirmBox);

  const levelButtons = levels.map((item) =>
    h('button', {
      class: 'level',
      type: 'button',
      'aria-pressed': String(item.id === level),
      onClick: () => askLevel(item.id),
    }, item.label),
  );

  root.replaceChildren(
    h('div', { class: 'game-page', 'data-game': game.id },
      h('header', { class: 'game-head' },
        h('a', { class: 'back', href: '#/' }, 'All snacks'),
        h('h1', null, game.title),
        levels.length > 1 && h('div', { class: 'levels', role: 'group', 'aria-label': game.levelName || 'Level' }, levelButtons),
      ),
      h('div', { class: 'game-body' },
        stage,
        h('div', { class: 'sayer' }, berryHost, bubble),
        actions,
      ),
    ),
  );

  function say(text, mood = 'idle') {
    bubble.textContent = text;
    berry.dataset.mood = mood;
  }

  function persist() {
    if (done || !instance) return;
    save(key, { level, state: instance.serialize() });
  }

  function syncButtons() {
    hintBtn.disabled = done || !actionsOn;
    answerBtn.disabled = done || !actionsOn;
    newBtn.textContent = done ? game.nextLabel || 'Next puzzle' : newLabel;
    newBtn.classList.toggle('btn-main', done);
  }

  const context = () => ({
    get level() { return level; },
    tools,
    say,
    save: persist,
    setActionsEnabled(on) {
      actionsOn = on;
      syncButtons();
    },
    finish({ revealed = false, message } = {}) {
      if (done) return;
      done = true;
      recordFinish();
      remove(key);
      const cheer = CHEERS[Math.floor(Math.random() * CHEERS.length)];
      say(message || (revealed ? 'There it is. On to the next whenever you like.' : cheer), 'happy');
      if (!revealed) dropCrumbs(berryHost);
      syncButtons();
      newBtn.focus();
    },
  });

  function start(savedState) {
    instance?.destroy?.();
    done = false;
    actionsOn = true;
    closeAsk();
    tools.replaceChildren();
    stage.replaceChildren();
    say(game.intro, 'idle');
    const holder = h('div', { class: 'game-holder' });
    stage.append(holder);
    instance = game.mount(holder, context(), savedState);
    syncButtons();
    persist();
  }

  function ask(question, yesLabel, onYes) {
    asking = true;
    buttons.hidden = true;
    confirmBox.hidden = false;
    const yes = h('button', {
      class: 'btn btn-main',
      type: 'button',
      onClick: () => { closeAsk(); onYes(); },
    }, yesLabel);
    confirmBox.replaceChildren(
      h('p', null, question),
      yes,
      h('button', { class: 'btn', type: 'button', onClick: closeAsk }, 'Keep going'),
    );
    yes.focus();
  }

  function closeAsk() {
    asking = false;
    buttons.hidden = false;
    confirmBox.hidden = true;
    confirmBox.replaceChildren();
  }

  function doHint() {
    if (done || !actionsOn || asking) return;
    instance.hint();
    persist();
  }

  function askAnswer() {
    if (done || !actionsOn || asking) return;
    ask('Show the answer?', 'Yes, show me', () => {
      instance.reveal();
      persist();
    });
  }

  function hasProgress() {
    return !done && (instance.hasProgress ? instance.hasProgress() : true);
  }

  function askNew() {
    if (asking) return;
    if (hasProgress()) ask('Start a new one? This one will be cleared.', 'Yes, start fresh', () => start());
    else start();
  }

  function setLevel(next) {
    level = next;
    levelButtons.forEach((button, index) => {
      button.setAttribute('aria-pressed', String(levels[index].id === next));
    });
    start();
  }

  function askLevel(next) {
    if (next === level || asking) return;
    if (hasProgress()) ask('Switch now? This one will be cleared.', 'Yes, switch', () => setLevel(next));
    else setLevel(next);
  }

  function onKey(event) {
    if (event.key === 'Escape' && asking) {
      closeAsk();
      return;
    }
    if (game.typing || event.ctrlKey || event.metaKey || event.altKey) return;
    const tag = event.target.tagName;
    if ((tag === 'INPUT' || tag === 'TEXTAREA') && !event.target.dataset.shortcuts) return;
    const letter = event.key.toLowerCase();
    if (letter === 'h') {
      event.preventDefault();
      doHint();
    }
    if (letter === 'n') {
      event.preventDefault();
      askNew();
    }
  }

  document.addEventListener('keydown', onKey);
  start(saved?.state);

  return function close() {
    document.removeEventListener('keydown', onKey);
    instance?.destroy?.();
  };
}
