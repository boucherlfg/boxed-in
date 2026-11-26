import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../src/rng.js';

const seq = (r, n = 100) => Array.from({ length: n }, () => r.next());

test('same seed gives identical sequence; different seeds differ', () => {
  assert.deepEqual(seq(createRng(42)), seq(createRng(42)));
  assert.notDeepEqual(seq(createRng(42)), seq(createRng(43)));
});

test('next is in [0,1)', () => {
  for (const v of seq(createRng(1), 1000)) assert.ok(v >= 0 && v < 1);
});

test('int(n) stays within [0,n)', () => {
  const r = createRng(7);
  for (let i = 0; i < 1000; i++) {
    const v = r.int(5);
    assert.ok(Number.isInteger(v) && v >= 0 && v < 5);
  }
});

test('pick returns an element of the array', () => {
  const r = createRng(9);
  const a = ['a', 'b', 'c'];
  for (let i = 0; i < 100; i++) assert.ok(a.includes(r.pick(a)));
});

test('setState(getState()) restores the sequence', () => {
  const r = createRng(5);
  seq(r, 10);
  const s = r.getState();
  const first = seq(r, 20);
  r.setState(s);
  assert.deepEqual(seq(r, 20), first);
});
