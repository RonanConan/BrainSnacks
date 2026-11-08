// localStorage with a fallback, so private windows and tests still work.
const memory = new Map();

function browserStore() {
  try {
    const store = globalThis.localStorage;
    if (store && typeof store.getItem === 'function') return store;
  } catch {
    // Storage can be blocked. Fall through to memory.
  }
  return null;
}

export function load(key, fallback = null) {
  try {
    // A value is only in memory when writing it to the browser failed, so it is the newest.
    const raw = memory.has(key) ? memory.get(key) : browserStore()?.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  const raw = JSON.stringify(value);
  try {
    const store = browserStore();
    if (store) {
      store.setItem(key, raw);
      memory.delete(key);
      return;
    }
  } catch {
    // Quota or privacy errors. Keep it for this visit at least.
  }
  memory.set(key, raw);
}

export function remove(key) {
  memory.delete(key);
  try {
    browserStore()?.removeItem(key);
  } catch {
    // Nothing useful to do.
  }
}
