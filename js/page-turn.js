// Turns from one tray to another. Both pages sit in the root during the turn:
// going forward the old page lifts off the new one, going back the new page lands on the old one.
const TURN_MS = 720;

let active = null;

export function isTurning() {
  return active !== null;
}

// Ends a turn straight away, for example when the route changes partway through.
export function finishTurn() {
  if (!active) return;
  const { root, from, to, timer } = active;
  clearTimeout(timer);
  active = null;
  from.remove();
  to.classList.remove('leaf-turning', 'leaf-top', 'leaf-under', 'leaf-back');
  root.style.minHeight = '';
}

export function turnPage({ root, from, to, forward }) {
  finishTurn();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    from.replaceWith(to);
    window.scrollTo(0, 0);
    return;
  }
  const scrolled = window.scrollY;
  // Both pages are lifted out of the flow, so hold the height to keep the scrollbar steady.
  root.style.minHeight = `${document.documentElement.scrollHeight}px`;
  from.inert = true;
  from.style.setProperty('--scrolled', `${scrolled}px`);
  const [top, under] = forward ? [from, to] : [to, from];
  top.classList.add('leaf-turning', 'leaf-top');
  under.classList.add('leaf-turning', 'leaf-under');
  if (!forward) {
    top.classList.add('leaf-back');
    under.classList.add('leaf-back');
  }
  root.append(to);
  window.scrollTo(0, 0);
  active = { root, from, to, timer: setTimeout(finishTurn, TURN_MS) };
}
