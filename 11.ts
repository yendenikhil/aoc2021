const p = console.log;
const raw = await Deno.readTextFile("11.txt");
const graph = raw.trim().split("\n").map((l) => l.split("").map(Number));
const len = graph.length;

const neighbours = (g: number[][], r: number, c: number): number[][] => {
  return [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([dr, dc]) => dr > -1 && dr < len && dc > -1 && dc < len);
};

const step = (g: number[][]): [number, number[][]] => {
  let gg = g.map((line) => line.map((e) => e + 1));
  // p(gg.map((line) => line.join("")).join("\n"));
  // flashes
  const allflash = gg.map((line) => line.map((e) => false));
  while (gg.some((line) => line.some((e) => e > 9))) {
    const flash = gg.map((line) => line.map((e) => e > 9 ? true : false));
    const newgg = gg.map((line) => line.slice());
    flash.forEach((line, r) =>
      line.forEach((cell, c) => {
        if (cell) {
          newgg[r][c] = 0;
          const nn = neighbours(gg, r, c);
          // if (r === 1 && c === 1) p({r, c, nn})
          // only increase by 1 if it has not flashed in this step
          nn.forEach(([dr, dc]) => {
            if (!flash[dr][dc] && !allflash[dr][dc]) newgg[dr][dc] += 1;
            // if (dr === 2 && dc === 2) p({r, c, dr, dc, gg: newgg[dr][dc], f: flash[dr][dc]})
          });
        }
      })
    );
    flash.forEach((line, r) =>
      line.forEach((cell, c) => {
        if (cell) allflash[r][c] = true;
      })
    );
    gg = newgg;
    // p('----')
    // p(gg.map((line) => line.join("")).join("\n"));
  }
  const count = allflash.map((line) => line.filter((e) => e).length).reduce((
    a,
    b,
  ) => a + b);
  return [count, gg];
};

let g1 = graph.map((line) => line.slice());
let count = 0;
let c = 0;
let i = 1;
while (true) {
  [c, g1] = step(g1);
  // p("-------");
  // p(g1.map((line) => line.join("")).join("\n"));
  if (c === 100) {
    break;
  }
  if (i <= 100) {
    count += c;
  }
  i++;
}
p({ count, i });
