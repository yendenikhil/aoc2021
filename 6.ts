const p = console.log;
const raw =
  "1,3,4,1,5,2,1,1,1,1,5,1,5,1,1,1,1,3,1,1,1,1,1,1,1,2,1,5,1,1,1,1,1,4,4,1,1,4,1,1,2,3,1,5,1,4,1,2,4,1,1,1,1,1,1,1,1,2,5,3,3,5,1,1,1,1,4,1,1,3,1,1,1,2,3,4,1,1,5,1,1,1,1,1,2,1,3,1,3,1,2,5,1,1,1,1,5,1,5,5,1,1,1,1,3,4,4,4,1,5,1,1,4,4,1,1,1,1,3,1,1,1,1,1,1,3,2,1,4,1,1,4,1,5,5,1,2,2,1,5,4,2,1,1,5,1,5,1,3,1,1,1,1,1,4,1,2,1,1,5,1,1,4,1,4,5,3,5,5,1,2,1,1,1,1,1,3,5,1,2,1,2,1,3,1,1,1,1,1,4,5,4,1,3,3,1,1,1,1,1,1,1,1,1,5,1,1,1,5,1,1,4,1,5,2,4,1,1,1,2,1,1,4,4,1,2,1,1,1,1,5,3,1,1,1,1,4,1,4,1,1,1,1,1,1,3,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,5,1,2,1,1,1,1,1,1,1,1,1";

const fishes = raw.split(",").map((e) => parseInt(e));

const next = (fishes: Map<number, number>) => {
  const zero = fishes.get(0) ?? 0;
  const nn = new Map();
  for (let i = 1; i < 9; i++) {
    nn.set(i - 1, fishes.get(i) ?? 0);
  }
  nn.set(8, zero);
  nn.set(6, zero + (nn.get(6) ?? 0));
  return nn;
};

const countPerDay = (m: Map<number, number>, f: number) => {
  m.set(f, (m.get(f) ?? 0) + 1);
  return m;
};

let f = fishes.reduce(countPerDay, new Map());
for (let i = 0; i < 80; i++) {
  f = next(f);
}
let p1 = 0;
f.forEach((v) => p1 += v);
p(p1);
f = fishes.reduce(countPerDay, new Map());
for (let i = 0; i < 256; i++) {
  f = next(f);
}
let p2 = 0;
f.forEach((v) => p2 += v);
p(p2);
