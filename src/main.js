// Entry point. Wiring only, no game logic (see DESIGN.md for the module layout).
const canvas = document.getElementById('game');
if (!canvas) throw new Error('Canvas #game not found');
console.error('deliberate');
