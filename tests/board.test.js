import test from 'node:test';
import assert from 'node:assert/strict';
import { inBounds, neighbors, cellKey, isEnemyAt, DIRECTIONS } from '../src/rules/board.js';

test('inBounds', () => {
  assert.equal(inBounds(0, 0), true);
  assert.equal(inBounds(8, 8), true);
  assert.equal(inBounds(-1, 0), false);
  assert.equal(inBounds(9, 0), false);
  assert.equal(inBounds(0, 9), false);
});

test('neighbors count', () => {
  assert.equal(neighbors(0, 0).length, 2);
  assert.equal(neighbors(4, 0).length, 3);
  assert.equal(neighbors(4, 4).length, 4);
});

test('cellKey and DIRECTIONS', () => {
  assert.equal(cellKey(2, 3), '2,3');
  assert.deepEqual(DIRECTIONS.up, { x: 0, y: -1 });
  assert.ok(Object.isFrozen(DIRECTIONS));
});

test('isEnemyAt', () => {
  const enemies = [{ x: 1, y: 2 }];
  assert.equal(isEnemyAt(enemies, 1, 2), true);
  assert.equal(isEnemyAt(enemies, 2, 1), false);
});
