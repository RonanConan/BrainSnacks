import { load, save } from './storage.js';
import { shuffle } from './random.js';

// Hands out ids in random order and only repeats once the whole pool has been used.
export function drawFromBag(name, ids, rng = Math.random) {
  const key = `bs.bag.${name}`;
  const valid = new Set(ids);
  let bag = load(key, []).filter((id) => valid.has(id));
  if (bag.length === 0) bag = shuffle(ids, rng);
  const id = bag.pop();
  save(key, bag);
  return id;
}
