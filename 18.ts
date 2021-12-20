const p = console.log;
const raw = await Deno.readTextFile("18.txt");
type S = {
  v: number;
  d: number;
};
const copyS = (a: S[]): S[] =>
  a.map((s) => {
    return { v: s.v, d: s.d };
  });
const parse = (line: string): S[] => {
  const match = line.match(/(\[|\]|\d+)/g);
  let depth = 0;
  const results: S[] = [];
  if (match !== null) {
    match.forEach((e) => {
      if (e === "[") depth++;
      else if (e === "]") depth--;
      else results.push({ v: Number(e), d: depth });
    });
  }
  return results;
};
const lines = raw.trim().split("\n").map(parse);

const add = (a: S[], b: S[]): S[] => {
  const res = a.map(({ v, d }) => {
    return { v, d: d + 1 };
  });
  const tmp = b.map(({ v, d }) => {
    return { v, d: d + 1 };
  });
  res.push(...tmp);
  return res;
};

const explode = (a: S[]): S[] => {
  const res: S[] = copyS(a);
  for (let i = 0; i < a.length - 1; i++) {
    const curr = res[i];
    const next = res[i + 1];
    if (curr.d === 5) {
      if (i > 0) res[i - 1].v += curr.v;
      if (i < a.length - 2) res[i + 2].v += next.v;
      curr.v = 0;
      curr.d -= 1;
      res.splice(i + 1, 1);
      break;
    }
  }
  return res;
};

const split = (a: S[]): S[] => {
  const res = copyS(a);
  for (let i = 0; i < res.length; i++) {
    if (res[i].v > 9) {
      const ov = Math.floor(res[i].v / 2);
      res[i].d += 1;
      const nv = Math.ceil(res[i].v / 2);
      const nd = res[i].d;
      res[i].v = ov;
      res.splice(i + 1, 0, { v: nv, d: nd });
      break;
    }
  }
  return res;
};

const eq = (a: S[], b: S[]) => a.length === b.length;

const process = (a: S[], b: S[]): S[] => {
  let input = add(a, b);
  while (true) {
    while (true) {
      const newin = explode(input);
      if (eq(newin, input)) break;
      input = newin;
    }
    const newin = split(input);
    if (eq(newin, input)) break;
    input = newin;
  }
  return input;
};

const mag = (input: S[]): number => {
  const max = input.map((e) => e.d).reduce((a, b) => a > b ? a : b);
  let res = copyS(input);
  for (let i = max; res.length > 1; i--) {
    const newres: S[] = [];
    for (let j = 0; j < res.length - 1; j += 2) {
      newres.push({ v: res[j].v * 3 + res[j + 1].v * 2, d: res[j].d - 1 });
    }
    res = newres;
  }
  return res[0].v;
};

console.time("a");
const start = lines[0];
const p1 = lines.slice(1).reduce(process, start);
p(mag(p1));
console.timeLog("a");

const max = (a: number, b: number): number => a > b ? a : b;
const p2 = lines
  .map((x, i) =>
    lines
      .filter((e, j) => i !== j)
      .map((y) => process(x, y))
      .map(mag)
      .reduce(max)
  ).reduce(max);
p(p2);
console.timeEnd("a");
