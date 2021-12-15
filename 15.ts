const p = console.log;
const raw = await Deno.readTextFile("15.txt");
const lines = raw.trim().split("\n");
const len = raw.split("\n")[0].length;
const tile = lines.map((line) => line.split("").map(Number));
const incrmod = (incr: number) =>
  (e: number): number => {
    const newval = e + incr;
    if (newval <= 9) return newval;
    else return newval - 9;
  };
const inc1 = incrmod(1);
const inc2 = incrmod(2);
const inc3 = incrmod(3);
const inc4 = incrmod(4);
const bigrow: number[][] = tile.map(
  (line) => [
    ...line,
    ...line.map(inc1),
    ...line.map(inc2),
    ...line.map(inc3),
    ...line.map(inc4),
  ]
);
const biggraphraw: number[][] = [
  ...bigrow,
  ...bigrow.map((line) => line.map(inc1)),
  ...bigrow.map((line) => line.map(inc2)),
  ...bigrow.map((line) => line.map(inc3)),
  ...bigrow.map((line) => line.map(inc4)),
];

const k = (r: number, c: number): string => JSON.stringify([r, c]);
const dk = (k: string): number[] => JSON.parse(k).map(Number);

const neighbors = (graph: Map<string, number>, len: number) =>
  ([r, c]: number[]): [string, number][] => {
    return [[-1, 0], [1, 0], [0, -1], [0, 1]]
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([dr, dc]) => dr >= 0 && dr < len && dc >= 0 && dc < len)
      .map(([dr, dc]) => [k(dr, dc), graph.get(k(dr, dc)) ?? 0]);
  };
const smallestNotVisited = (visited: Set<string>) =>
  (dist: Map<string, number>): string => {
    let min = Infinity;
    let key = "";
    dist.forEach((v, k) => {
      if (!visited.has(k) && min > v) {
        min = v;
        key = k;
      }
    });
    if (min === Infinity) {
      dist.forEach((v, k) => {
        if (v < Infinity && !visited.has(k)) {
          p({ k, v });
        }
      });
    }
    return key;
  };

const graph: Map<string, number> = new Map();
const biggraph: Map<string, number> = new Map();

tile.forEach((line, r) =>
  line.forEach((cell, c) => {
    graph.set(k(r, c), cell);
  })
);
biggraphraw.forEach((line, r) =>
  line.forEach((cell, c) => {
    biggraph.set(k(r, c), cell);
  })
);
const edges: Map<string, [string, number][]> = new Map(); // the key is from, the first val is to and second val is weight
const nn = neighbors(graph, len);
graph.forEach((v, k) => {
  const val = nn(dk(k));
  edges.set(k, val);
});
const bigedges: Map<string, [string, number][]> = new Map(); // the key is from, the first val is to and second val is weight
const bignn = neighbors(biggraph, len * 5);
biggraph.forEach((v, k) => {
  const val = bignn(dk(k));
  bigedges.set(k, val);
});

const dijkstra = (
  graph: Map<string, number>,
  edges: Map<string, [string, number][]>,
  len: number,
) => {
  const visited: Set<string> = new Set();
  const smallest = smallestNotVisited(visited);
  const dist: Map<string, number> = new Map();
  graph.forEach((v, k) => dist.set(k, Infinity));
  dist.set(k(0, 0), 0);
  while (visited.size < dist.size) {
    const curr = smallest(dist);
    const currweight = dist.get(curr) ?? Infinity;
    // p({curr, currweight})
    visited.add(curr);
    const es = edges.get(curr);
    if (!es) {
      p("ERROR");
      break;
    }
    es.forEach(([k, w]) => {
      const oldval = dist.get(k) ?? Infinity;
      if ((currweight + w) < oldval) {
        dist.set(k, currweight + w);
      }
    });
  }
  p(dist.get(k(len - 1, len - 1)));
};

console.time("a");
dijkstra(graph, edges, len);
console.timeLog("a");

dijkstra(biggraph, bigedges, len * 5);
console.timeLog("a");
