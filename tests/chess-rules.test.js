const assert = require('node:assert/strict');
const { Chess } = require('../vendor-chess.min.js');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('legal move validation rejects a pinned rook move', () => {
  const game = new Chess('4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1');
  assert.equal(game.move({ from: 'e2', to: 'd2' }), null);
  assert.equal(game.turn(), 'w');
});

test('check is detected', () => {
  const game = new Chess('4k3/8/8/8/8/8/4r3/4K3 w - - 0 1');
  assert.equal(game.in_check(), true);
});

test('checkmate is detected', () => {
  const game = new Chess();
  ['f3', 'e5', 'g4', 'Qh4#'].forEach((move) => assert.ok(game.move(move)));
  assert.equal(game.in_checkmate(), true);
});

test('stalemate is detected separately from checkmate', () => {
  const game = new Chess('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
  assert.equal(game.in_stalemate(), true);
  assert.equal(game.in_checkmate(), false);
});

test('kingside castling moves both king and rook', () => {
  const game = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const move = game.move({ from: 'e1', to: 'g1' });
  assert.ok(move.flags.includes('k'));
  assert.equal(game.get('g1').type, 'k');
  assert.equal(game.get('f1').type, 'r');
});

test('en passant removes the passed pawn', () => {
  const game = new Chess('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
  const move = game.move({ from: 'e5', to: 'd6' });
  assert.ok(move.flags.includes('e'));
  assert.equal(game.get('d6').type, 'p');
  assert.equal(game.get('d5'), null);
});

test('pawn promotion creates the selected piece', () => {
  const game = new Chess('4k3/P7/8/8/8/8/8/4K3 w - - 0 1');
  const move = game.move({ from: 'a7', to: 'a8', promotion: 'q' });
  assert.equal(move.promotion, 'q');
  assert.equal(game.get('a8').type, 'q');
});

