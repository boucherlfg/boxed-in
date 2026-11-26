import test from 'node:test';
import assert from 'node:assert/strict';
import { BOARD_SIZE, PLAYER_START, SPAWN_TILES, AI_DEPTH, CELL_SIZE, COLORS } from '../src/config.js';

test('board and player start', () => {
  assert.equal(BOARD_SIZE, 9);
  assert.deepEqual(PLAYER_START, { x: 4, y: 4 });
});

test('spawn tiles are B2, H2, B8, H8', () => {
  assert.deepEqual(SPAWN_TILES, [{ x: 1, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 7 }, { x: 7, y: 7 }]);
});

test('AI depth, cell size, colors', () => {
  assert.equal(AI_DEPTH, 3);
  assert.equal(CELL_SIZE, 64);
  for (const k of ['background', 'grid', 'player', 'enemy', 'spawn', 'highlight']) {
    assert.match(COLORS[k], /^#[0-9a-f]{6}$/i);
  }
  assert.ok(Object.isFrozen(COLORS) && Object.isFrozen(SPAWN_TILES));
});
