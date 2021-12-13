const p = console.log;
const raw = await Deno.readTextFile("13.txt");
const lines = raw.trim().split("\n");

const dots = [];
for (let line of lines) {
  if (line.trim() === "") break;
  dots.push(line.split(",").map(Number));
}

const folds: [string, number][] = lines.slice(lines.indexOf("") + 1).map(
  (line) => line.replace("fold along ", "").split("=")
).map(([a, b]) => [a, parseInt(b)]);
let p1 = dots.map((e) => e.slice());
const p1set: Set<string> = new Set();
folds.slice(0, 1).forEach(([f1, f2]: [string, number]) => {
  if (f1 === "x") {
    p1.map(([x, y]) => {
      if (x < f2) return [x, y];
      else {
        const dist = x - f2;
        return [f2 - dist, y];
      }
    }).forEach((e) => p1set.add(JSON.stringify(e)));
  }
});
p(p1set.size);

let p2 = dots.map((e) => e.slice());
folds.forEach(([f1, f2]: [string, number]) => {
  if (f1 === "x") {
    p2 = p2.map(([x, y]) => {
      if (x < f2) return [x, y];
      else {
        const dist = x - f2;
        return [f2 - dist, y];
      }
    });
  } else {
    p2 = p2.map(([x, y]) => {
      if (y < f2) return [x, y];
      else {
        const dist = y - f2;
        return [x, f2 - dist];
      }
    });
  }
});

const maxx = p2.map((e) => e[0]).reduce((acc, x) => acc < x ? x : acc);
const maxy = p2.map((e) => e[1]).reduce((acc, x) => acc < x ? x : acc);
const p2display: string[][] = [];
for (let y = 0; y <= maxy; y++) {
  p2display[y] = [];
  for (let x = 0; x <= maxx; x++) {
    p2display[y][x] = " ";
  }
}

p2.forEach(([x, y]) => {
  p2display[y][x] = "#";
});
p2display.forEach((line) => p(line.join("")));
