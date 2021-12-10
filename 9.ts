const p = console.log;
const raw = await Deno.readTextFile("9.txt");
const lines = raw.trim().split("\n");
const graph = lines.map((line) => line.split("").map((e) => parseInt(e)));

const nn = (r: number, c: number): number[] => {
  return [[-1, 0], [1, 0], [0, -1], [0, 1]]
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([dr, dc]) => dr > -1 && dc > -1 && dr < 100 && dc < 100)
    .map(([dr, dc]) => graph[dr][dc]);
};

const lowPoints: number[] = [];
const lowLoc: number[][] = [];
graph.forEach((line, r) =>
  line.forEach((cell, c) => {
    // p({cell, nn: nn(r,c)})
    if (nn(r, c).every((ee) => ee > cell)) {
      lowPoints.push(cell);
      lowLoc.push([r, c]);
    }
  })
);
p(lowPoints.map((e) => e + 1).reduce((a, b) => a + b));

const basin = (r: number, c: number): number => {
  const queue = [[r, c]];
  const visited: Set<string> = new Set();
  while (queue.length > 0) {
    const curr = queue.shift();
    if (!curr) break;
    if (visited.has(JSON.stringify(curr))) continue;
    visited.add(JSON.stringify(curr));

    const n = [[-1, 0], [1, 0], [0, -1], [0, 1]]
      .map(([dr, dc]) => [curr[0] + dr, curr[1] + dc])
      .filter(([dr, dc]) => dr > -1 && dc > -1 && dr < 100 && dc < 100)
      .filter((e: number[]) => !visited.has(JSON.stringify(e)))
      .filter(([dr, dc]) => graph[dr][dc] !== 9);
    queue.push(...n);
    // p({curr, n, visited})
  }
  return visited.size;
};
const b = lowLoc.map(([r, c]) => basin(r, c));
b.sort((a, b) => a - b);
p(b[b.length - 1] * b[b.length - 2] * b[b.length - 3]);
