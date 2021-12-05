const p = console.log;
const raw = await Deno.readTextFile("5.txt");
const lines = raw.trim().split("\n");
interface VentLine {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

const vLines = lines.map((line) => line.split(" -> "))
  .map((
    [left, right],
  ) => [
    ...left.split(",").map((e) => parseInt(e)),
    ...right.split(",").map((e) => parseInt(e)),
  ])
  .map(([x1, y1, x2, y2]) => {
    return { x1, x2, y1, y2 } as VentLine;
  });

const isStraight = (v: VentLine): boolean => v.x1 === v.x2 || v.y1 === v.y2;
const expand = (v: VentLine): number[][] => {
  if (v.x1 === v.x2) {
    const start = v.y1 > v.y2 ? v.y2 : v.y1;
    const end = v.y1 > v.y2 ? v.y1 : v.y2;
    const results = [];
    for (let i = start; i <= end; i++) {
      results.push([v.x1, i]);
    }
    return results;
  } else if (v.y1 === v.y2) {
    const start = v.x1 > v.x2 ? v.x2 : v.x1;
    const end = v.x1 > v.x2 ? v.x1 : v.x2;
    const results = [];
    for (let i = start; i <= end; i++) {
      results.push([i, v.y1]);
    }
    return results;
  } else {
    const xMult = v.x1 < v.x2 ? 1 : -1;
    const yMult = v.y1 < v.y2 ? 1 : -1;
    const size = Math.abs(v.x1 - v.x2);
    const results = [];
    for (let i = 0; i <= size; i++) {
      results.push([v.x1 + (i * xMult), v.y1 + (i * yMult)]);
    }
    return results;
  }
};

const res: Map<string, number> = new Map();

vLines.filter(isStraight).map(expand)
  .forEach((list) => {
    list.forEach((e) => {
      let val = res.get(JSON.stringify(e)) ?? 0;
      res.set(JSON.stringify(e), val + 1);
    });
  });
let counter = 0;
res.forEach((v, k) => {
  if (v > 1) counter++;
});
p(counter);
vLines.filter((v) => !isStraight(v)).map(expand)
  .forEach((list) => {
    list.forEach((e) => {
      let val = res.get(JSON.stringify(e)) ?? 0;
      res.set(JSON.stringify(e), val + 1);
    });
  });
counter = 0;
res.forEach((v, k) => {
  if (v > 1) counter++;
});
p(counter);
