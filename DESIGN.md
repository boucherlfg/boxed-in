# Boxed In - Design Document (v0.1 DRAFT)

> Working title. Status: draft awaiting owner validation. Items marked **[ASSUMPTION]** were not explicitly specified and need confirmation.

## Concept
A single-player, turn-based survival game on a 9x9 grid. The player walks around while a minimax-driven enemy side spawns and moves walls to trap them. Enemies cannot be killed, pushed or passed: they are permanent walls. The game ends when the player has no legal move. Score is the number of turns survived; the best score is saved locally.

## Core loop
1. Player moves one cell orthogonally (mandatory, no passing).
2. Enemy phase: the enemy side takes exactly one action, chosen by minimax: move one enemy one cell, or spawn a new enemy on a free spawn tile.
3. If the player has no legal move -> game over. Else turn counter +1, go to 1.

## Rules spec (source of truth for the rules engine)
- Board: 9x9, coordinates (x, y), origin top-left. Player starts at (4, 4). Board starts with no enemies.
- All movement is orthogonal, one cell per move, for player and enemies.
- Board edges are walls. Moving off-board is illegal.
- Legal player move: target cell is on the board and contains no enemy.
- Enemies can never enter the player's cell. Enemies never move onto another enemy.
- Enemy phase: the enemy side takes exactly **one action** per turn, either:
  - **Move**: one existing enemy steps one cell orthogonally onto a free cell (on the board, no enemy, not the player), or
  - **Spawn**: a new enemy appears on one of the four spawn tiles, if that tile is free.
- Spawn tiles (fixed): **B2, H2, B8, H8**. Columns A-I left to right, rows 1-9 top to bottom, so in (x, y) coordinates: (1,1), (7,1), (1,7), (7,7). There is **no spawn cooldown or cap**; spawning is just one of the available actions each turn.
- If the enemy side has no legal action (no enemy can move and every spawn tile is occupied), it passes.
- Enemy AI = depth-limited **minimax with alpha-beta pruning**, `AI_DEPTH = 3` plies, starting with the enemy action at the root (enemy, player, enemy). The enemy side minimizes and the player maximizes.
  - Evaluation of a leaf: number of cells reachable by the player (flood fill through non-enemy cells), with the player's immediate legal move count as secondary term.
  - A position where the player has no legal move is terminal with the worst possible score for the player; faster traps score better than slower ones.
  - Ties between equal-scored actions are broken with the seeded RNG. **[ASSUMPTION]**
- Game over: evaluated at the end of each turn (after enemy move and spawn). The player has zero legal moves.
- Score: number of player moves completed before game over. Best score persisted in `localStorage`.
- Determinism: all randomness comes from a seeded RNG owned by the game state. Same seed + same inputs = same game.

## Controls
- Keyboard: W/A/S/D and arrow keys, one step per key event. Held-key behavior follows the OS key-repeat (each repeat is a separate move).
- Mouse: click a legal adjacent tile to move there. Clicking a non-adjacent tile does nothing. Legal destination tiles are highlighted on hover.
- Illegal input never consumes a turn.
- After game over, a key or click restarts the game.

## Presentation
- HTML5 Canvas, placeholder shapes and flat colors (no asset pipeline).
- Always visible: turn counter, best score. Game-over overlay shows the final score and "new best" when relevant.

## MVP features
1. Rules engine: board, player move, enemy actions (move/spawn), game-over detection (pure JS, no DOM).
1b. Enemy AI: minimax depth 3 with alpha-beta, evaluation by player reachability.
2. Seeded RNG.
3. Canvas rendering of board, player, enemies.
4. Keyboard input (WASD + arrows).
5. Mouse input with legal-tile highlight.
6. HUD: turn counter, best score (localStorage).
7. Game-over screen and restart.

## Stretch goals (post-MVP, one task each)
- Difficulty setting (AI depth selectable at start).
- AI performance work if depth > 3 is too slow (move ordering, transposition table).
- Move animations and simple sound effects.
- Undo-free replay: share a seed to replay the same game.
- Multi-step click-to-move.

## Technical approach
- Platform: HTML5, vanilla JS (ES modules), no build step, no dependencies for the game itself. Dev-only tooling (test runner, Playwright smoke test) lives under `tools/`.
- Strict separation of concerns, one responsibility per file:

```
src/
  config.js            constants (board size, spawn interval, colors)
  rng.js               seeded RNG
  rules/
    board.js           bounds, neighbors, cell queries
    player.js          legal player moves
    enemy.js           legal enemy actions (moves + spawns), applying an action
    reachability.js    flood fill / mobility metrics for the evaluation
    enemyAI.js         chooseEnemyAction(state): minimax + alpha-beta
    gameover.js        end-of-game detection
  state/
    gameState.js       state shape + createGame(seed)
    turn.js            applyPlayerMove(state, dir) -> new state (pure)
    storage.js         best score persistence
  input/
    keyboard.js        key -> direction
    pointer.js         click -> tile -> direction
  render/
    canvas.js          draw board, entities
    hud.js             turn counter, best score, game-over overlay
  main.js              wiring only, no logic
tests/                 pure-logic tests for rules/ and state/
tools/                 smoke test, build/preview scripts
```

- `rules/` and `state/` must not touch the DOM, `window`, `Math.random` or `Date`. This makes them unit-testable in plain Node and keeps tasks atomic (one file = one concern = low merge conflict risk).

## Open questions for the owner
1. Tie-break between equal-scored AI actions: seeded RNG (assumption) or fixed order?
2. Balance risk: with uncapped spawning and a perfect-ish trapper, games may end very quickly. Accepted for the MVP; `AI_DEPTH` is the tuning knob.

Status: otherwise frozen.
