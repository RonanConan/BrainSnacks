// Random helpers. Every function takes an optional rng so tests can be repeatable.

export function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(min, max, rng = Math.random) {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick(items, rng = Math.random) {
  return items[Math.floor(rng() * items.length)];
}

export function shuffle(items, rng = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function sample(items, count, rng = Math.random) {
  return shuffle(items, rng).slice(0, count);
}
