// Seeded deterministic RNG (mulberry32). Pure: no Math.random, no Date.

export function createRng(seed) {
  let state = seed >>> 0;

  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(n) {
    return Math.floor(next() * n);
  }

  function pick(array) {
    return array[int(array.length)];
  }

  function getState() {
    return state;
  }

  function setState(s) {
    state = s >>> 0;
  }

  return { next, int, pick, getState, setState };
}
