const p = console.log;
const raw = await Deno.readTextFile("20.txt");
const lines = raw.trim().split("\n");
const ref = lines[0].split("").map((e) => e === "." ? "0" : "1");
const graph: string[][] = lines.slice(2).map((line) =>
  line.split("").map((e) => e === "." ? "0" : "1")
);

const pad = (graph: string[][], extra: number, padding: string): string[][] => {
  const top = [...Array((2 * extra) + graph.length).keys()].map((e) => padding);
  const left = [...Array(extra).keys()].map((e) => padding);
  const gg: string[][] = graph.map((line) => [...left, ...line, ...left]);
  left.forEach(() => {
    gg.unshift(top);
    gg.push(top);
  });
  return gg;
};

const next = (graph: string[][], def: string) =>
  (r: number, c: number): string => {
    const len = graph.length;
    const bin = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [
      1,
      0,
    ], [1, 1]]
      .map(([dr, dc]) => [r + dr, c + dc])
      .map(([dr, dc]) => {
        if (dr < 0 || dr > len - 1 || dc < 0 || dc > len - 1) {
          return def;
        } else {
          return graph[dr][dc];
        }
      }).join("");
    const idx = parseInt(bin, 2);
    return ref[idx];
  };

const step = (graph: string[][], def: string) => {
  const g0 = pad(graph, 1, def);
  const n1 = next(g0, def);
  const g1 = g0.map((line, r) => line.map((cell, c) => n1(r, c)));
  return g1;
};

let gg = graph.map((line) => line.slice());
console.time("a");
for (let i = 0; i < 2; i++) {
  gg = step(gg, i % 2 === 0 ? "0" : "1");
}
p(
  gg.map((line) => line.filter((e) => e === "1").length).reduce((a, b) =>
    a + b
  ),
);
console.timeLog("a");
gg = graph.map((line) => line.slice());
for (let i = 0; i < 50; i++) {
  gg = step(gg, i % 2 === 0 ? "0" : "1");
}
p(
  gg.map((line) => line.filter((e) => e === "1").length).reduce((a, b) =>
    a + b
  ),
);
console.timeEnd("a");
