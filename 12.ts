const p = console.log;
const raw = await Deno.readTextFile("12.txt");
const lines: string[][] = raw.trim().split("\n")
  .map((line) => line.split("-"))
  .map(([a, b]) => {
    if (a === "end" || b === "start") return [b, a];
    else return [a, b];
  });

interface Path {
  p: string[];
  visited: Map<string, number>;
}
const newpath = (p: string[]): Path => {
  return { p, visited: new Map() };
};
const copypath = (path: Path): Path => {
  const visited = new Map();
  path.visited.forEach((v, k) => visited.set(k, v));
  return {
    p: path.p.slice(),
    visited,
  };
};
const lastEle = (arr: any[]): any => arr[arr.length - 1];

const paths = lines.filter((e) => e[0] !== "start");
paths.push(...paths.filter((e) => e[1] !== "end").map(([a, b]) => [b, a]));
// p(paths)
const traverse = (queue: Path[], maxVisits: number): number => {
  const distinctPaths: Set<string> = new Set();
  while (queue.length > 0) {
    // if (counter > 90) break
    const curr = queue.pop();
    // p({curr})
    if (!curr) break;
    const { p: pp, visited } = curr;
    const last = lastEle(pp);
    if (last === "end") {
      // p(`>>>>>>> ${JSON.stringify(pp)}`)
      let twos = 0;
      visited.forEach((v) => twos += v === 2 ? 1 : 0);
      if (twos < 2) {
        distinctPaths.add(JSON.stringify(pp));
      }
      continue;
    }
    if (visited.has(last) && (visited.get(last) ?? 0) >= maxVisits) continue;
    if (last.search(/[a-z]+/) > -1) {
      visited.set(last, (visited.get(last) ?? 0) + 1);
    }
    let twos = 0;
    visited.forEach((v) => twos += v === 2 ? 1 : 0);
    if (twos > 1) {
      continue;
    }
    const nn = paths
      .filter((e) => e[0] === last && (visited.get(e[1]) ?? 0) < maxVisits)
      .map((e) => {
        const newpath = copypath(curr);
        newpath.p.push(e[1]);
        return newpath;
      });
    // p({curr, nn})
    // p({curr})
    queue.push(...nn);
  }
  // p(distinctPaths)
  return distinctPaths.size;
};

const queue1 = lines.filter((e) => e[0] === "start").map(newpath);
const queue2 = lines.filter((e) => e[0] === "start").map(newpath);
console.time("a");
p(traverse(queue1, 1));
console.timeLog("a");
p(traverse(queue2, 2));
console.timeEnd("a");
