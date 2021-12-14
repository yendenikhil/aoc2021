const p = console.log;
const raw = await Deno.readTextFile("14.txt");
const lines = raw.trim().split("\n");

const form: Map<string, string[]> = new Map();
lines.slice(2).map((e) => e.split(" -> ")).forEach(([a, b]) => {
  form.set(a, [a[0] + b, b + a[1]]);
});

const steps = (input: string, steps: number): void => {
  let pairs: Map<string, number> = new Map();
  for (let i = 0; i < input.length - 1; i++) {
    const p = input.slice(i, i + 2);
    pairs.set(p, (pairs.get(p) ?? 0) + 1);
  }
  for (let i = 0; i < steps; i++) {
    pairs = expand(pairs);
  }
  const counts = new Map();
  pairs.forEach((v, k) => {
    counts.set(k[0], (counts.get(k[0]) ?? 0) + v);
  });
  const last = input.slice(-1);
  counts.set(last, (counts.get(last) ?? 0) + 1);
  // p(pairs)
  // p(counts)
  const tmp: number[] = [];
  counts.forEach((v) => tmp.push(v));
  const min = Math.min(...tmp);
  const max = Math.max(...tmp);
  p(max - min);
};

const expand = (pairs: Map<string, number>): Map<string, number> => {
  const results = new Map();
  pairs.forEach((v, k) => {
    const [a, b] = form.get(k) ?? ["", ""];
    results.set(a, v + (results.get(a) ?? 0));
    results.set(b, v + (results.get(b) ?? 0));
    // p({results, a, b, v, k})
  });
  return results;
};

console.time("a");
steps(lines[0], 10);
console.timeLog("a");
steps(lines[0], 40);
console.timeEnd("a");
