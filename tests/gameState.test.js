import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, cloneState } from '../src/state/gameState.js';

test('createGame(1) has the initial shape', () => {
  const g = createGame(1);
  assert.deepEqual(g.player, { x: 4, y: 4 });
  assert.deepEqual(g.enemies, []);
  assert.equal(g.turn, 0);
  assert.equal(g.over, false);
  assert.equal(g.seed, 1);
});

test('mutating a clone does not alter the original', () => {
  const g = createGame(1);
  g.enemies.push({ x: 1, y: 1 });
  const c = cloneState(g);
  c.player.x = 0;
  c.enemies[0].x = 8;
  c.enemies.push({ x: 2, y: 2 });
  c.turn = 5;
  c.rng.next();
  assert.deepEqual(g.player, { x: 4, y: 4 });
  assert.deepEqual(g.enemies, [{ x: 1, y: 1 }]);
  assert.equal(g.turn, 0);
});

test('same seed gives identical rng sequences', () => {
  const a = createGame(42);
  const b = createGame(42);
  for (let i = 0; i < 10; i++) assert.equal(a.rng.next(), b.rng.next());
});

test('clone carries rng state and advances independently', () => {
  const g = createGame(7);
  g.rng.next();
  const c = cloneState(g);
  const first = c.rng.next();
  assert.equal(g.rng.next(), first);
});
