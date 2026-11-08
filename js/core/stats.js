import { load, save } from './storage.js';

const KEY = 'bs.stats';

function dayStamp(now) {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getStats() {
  return load(KEY, { finished: 0, days: 0, lastDay: null });
}

export function recordFinish(now = new Date()) {
  const stats = getStats();
  const today = dayStamp(now);
  stats.finished += 1;
  if (stats.lastDay !== today) {
    stats.days += 1;
    stats.lastDay = today;
  }
  save(KEY, stats);
  return stats;
}
