// Game constants. Pure data, no logic, no DOM.

export const BOARD_SIZE = 9;
export const CELL_SIZE = 64;
export const AI_DEPTH = 3;

export const PLAYER_START = Object.freeze({ x: 4, y: 4 });

export const SPAWN_TILES = Object.freeze([
  Object.freeze({ x: 1, y: 1 }),
  Object.freeze({ x: 7, y: 1 }),
  Object.freeze({ x: 1, y: 7 }),
  Object.freeze({ x: 7, y: 7 }),
]);

export const COLORS = Object.freeze({
  background: '#1b1b24',
  grid: '#3a3a4a',
  player: '#4fc3f7',
  enemy: '#e53935',
  spawn: '#6d4c41',
  highlight: '#fdd835',
});
