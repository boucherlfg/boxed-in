// Board geometry helpers. Pure logic, no DOM.
import { BOARD_SIZE } from '../config.js';

export const DIRECTIONS = Object.freeze({
  up: Object.freeze({ x: 0, y: -1 }),
  down: Object.freeze({ x: 0, y: 1 }),
  left: Object.freeze({ x: -1, y: 0 }),
  right: Object.freeze({ x: 1, y: 0 }),
});

export function inBounds(x, y) {
  return Number.isInteger(x) && Number.isInteger(y) &&
    x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE;
}

export function neighbors(x, y) {
  return Object.values(DIRECTIONS)
    .map((d) => ({ x: x + d.x, y: y + d.y }))
    .filter((c) => inBounds(c.x, c.y));
}

export function cellKey(x, y) {
  return `${x},${y}`;
}

export function isEnemyAt(enemies, x, y) {
  return enemies.some((e) => e.x === x && e.y === y);
}
