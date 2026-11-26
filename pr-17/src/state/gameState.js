// Game state shape and factory. Pure logic, no DOM.
import { PLAYER_START } from '../config.js';
import { createRng } from '../rng.js';

export function createGame(seed) {
  return {
    player: { x: PLAYER_START.x, y: PLAYER_START.y },
    enemies: [],
    turn: 0,
    over: false,
    seed,
    rng: createRng(seed),
  };
}

// Copies player and enemies; the clone gets its own RNG at the same position.
export function cloneState(state) {
  const rng = createRng(state.seed);
  rng.setState(state.rng.getState());
  return {
    ...state,
    player: { ...state.player },
    enemies: state.enemies.map((e) => ({ ...e })),
    rng,
  };
}
