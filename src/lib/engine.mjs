export function shuffled(size, random = Math.random) {
  const a = Array.from({ length: size }, (_, i) => i);
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((x, i) => x === i) && size > 1) [a[0], a[1]] = [a[1], a[0]];
  return a;
}
export function adjacent(a, b, n = 3) {
  return (
    Math.abs(Math.floor(a / n) - Math.floor(b / n)) +
      Math.abs((a % n) - (b % n)) ===
    1
  );
}
export function moveTile(board, index, n = 3) {
  const empty = board.indexOf(n * n - 1);
  if (!adjacent(index, empty, n)) return board;
  const a = [...board];
  [a[index], a[empty]] = [a[empty], a[index]];
  return a;
}
export function slidingBoard(n = 3, steps = 24, random = Math.random) {
  let a = Array.from({ length: n * n }, (_, i) => i),
    previous = -1;
  for (let i = 0; i < steps; i++) {
    const empty = a.indexOf(n * n - 1),
      valid = a
        .map((_, j) => j)
        .filter((j) => adjacent(j, empty, n) && j !== previous);
    const chosen = valid[Math.floor(random() * valid.length)];
    a = moveTile(a, chosen, n);
    previous = empty;
  }
  if (a.every((x, i) => x === i)) a = moveTile(a, n * n - 2, n);
  return a;
}
export const solved = (board) => board.every((x, i) => x === i);
