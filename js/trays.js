// The trays are pages of the book, in the order you turn through them.
export const TRAYS = [
  { id: 'puzzles', label: 'Puzzles', hash: '#/' },
  { id: 'arcade', label: 'Arcade', hash: '#/arcade' },
];

// Anything that isn't another tray or a game lands on the first page.
export function trayForRoute(routeId) {
  return TRAYS.find((tray) => tray.hash === `#/${routeId}`) ?? TRAYS[0];
}

export function neighbour(tray, step) {
  return TRAYS[TRAYS.indexOf(tray) + step] ?? null;
}

export function isForward(from, to) {
  return TRAYS.indexOf(to) > TRAYS.indexOf(from);
}
