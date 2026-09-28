import { test } from "node:test";
import assert from "node:assert/strict";
import {
  shuffled,
  slidingBoard,
  moveTile,
  solved,
  adjacent,
} from "../src/lib/engine.mjs";
test("1000 tableros deslizantes tienen permutación válida y paridad resoluble", () => {
  for (let n = 0; n < 1000; n++) {
    const b = slidingBoard();
    assert.deepEqual([...b].sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    assert.equal(solved(b), false);
    const values = b.filter((x) => x !== 8);
    let inversions = 0;
    for (let i = 0; i < 8; i++)
      for (let j = i + 1; j < 8; j++) if (values[i] > values[j]) inversions++;
    assert.equal(inversions % 2, 0);
  }
});
test("no permite saltos ni diagonales y mantiene el original", () => {
  const b = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  assert.equal(moveTile(b, 0), b);
  assert.equal(moveTile(b, 4), b);
  assert.deepEqual(moveTile(b, 7), [0, 1, 2, 3, 4, 5, 6, 8, 7]);
  assert.deepEqual(b, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(adjacent(2, 3), false);
});
test("baraja sin perder piezas y evita inicio resuelto", () => {
  for (let i = 0; i < 100; i++) {
    const b = shuffled(12);
    assert.deepEqual(
      [...b].sort((a, b) => a - b),
      Array.from({ length: 12 }, (_, i) => i),
    );
    assert.equal(solved(b), false);
  }
});
