const p = console.log;
const raw = await Deno.readTextFile("19.txt");
type Pos = [number, number, number];
const cp = (p1: Pos, p2: Pos): boolean =>
  p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2];

class Scanner {
  id: number;
  s?: Pos;
  b: Pos[];
  bb: Pos[][];
  constructor(lines: string[], s?: Pos) {
    this.id = Number(
      lines[0]
        .replace("--- scanner ", "").replace(" ---", ""),
    );
    this.s = s;
    this.b = lines.slice(1)
      .map((line) =>
        line.split(",")
          .map(Number)
      ).map(([a, b, c]) => [a, b, c]);
    this.bb = [];
    this.seq();
  }
  seq(): void {
    this.bb.push(...zip(...this.b.map((pos) => this.tr(pos))));
    /*
    const tmp: Pos[][] = this.b.map((pos) => this.tr(pos))
    for(let i = 0; i < 24; i++) {
      const t: Pos[] = []
      t.push(...tmp.map(e => e[i]))
      this.bb.push(t)
    }
    */
  }
  tr(pos: Pos): Pos[] {
    const [x, y, z] = pos;
    return [
      [x, y, z],
      [z, y, -x],
      [-x, y, -z],
      [-z, y, x],
      [-y, x, z],
      [z, x, y],
      [y, x, -z],
      [-z, x, -y],
      [y, -x, z],
      [z, -x, -y],
      [-y, -x, -z],
      [-z, -x, y],
      [x, -z, y],
      [y, -z, -x],
      [-x, -z, -y],
      [-y, -z, x],
      [x, -y, -z],
      [-z, -y, -x],
      [-x, -y, z],
      [z, -y, x],
      [x, z, -y],
      [-y, z, -x],
      [-x, z, y],
      [y, z, x],
    ];
  }
  /*
   seq(): void {
    const roll = ([x, y, z]: Pos): Pos => [x, z, -1 * y];
    const turn = ([x, y, z]: Pos): Pos => [-1 * y, x, z];
    let v = this.b.slice();
    //this.bb.push(v)
    const aa1 = [0, 1];
    const aa2 = [0, 1, 2];
    aa1.forEach(() => {
      aa2.forEach(() => {
        v = v.map(roll);
        this.bb.push(v);
        aa2.forEach(() => {
          v = v.map(turn);
          this.bb.push(v);
        });
      });
    });
  }
  */
}

const zip = <T>(...arr: T[][]): T[][] => {
  const ans: T[][] = [];
  const len = Math.min(...arr.map((e) => e.length));
  for (let i = 0; i < len; i++) {
    ans.push(arr.map((e) => e[i]));
  }
  return ans;
};
const scanners: Scanner[] = raw.trim().split("\n\n").map((block) =>
  block.split("\n")
).map((lines) => new Scanner(lines));
scanners[0].s = [0, 0, 0];

const md = (p1: Pos | undefined, p2: Pos | undefined): number => {
  if (p1 === undefined || p2 === undefined) return -1;
  return zip(p1, p2).map(([a, b]) => Math.abs(a - b)).reduce((a, b) => a + b);
};

console.time("a");
while (scanners.filter((s) => s.s === undefined).length > 0) {
  for (const s2 of scanners.filter((s) => s.s === undefined)) {
    for (const ps2 of s2.bb) {
      const dist: Map<string, number> = new Map();
      const intersection: Map<string, Array<[Pos, Pos]>> = new Map();
      // p({s2: s2.id, s1s: scanners.filter(s => s.s !== undefined).map(s => s.id)})
      for (
        const p1 of scanners.filter((s) => s.s !== undefined).map((s) => s.b)
          .flat()
      ) {
        for (const p2 of ps2) {
          const diff = zip(p1, p2).map(([a, b]) => a - b);
          const key = JSON.stringify(diff);
          dist.set(key, (dist.get(key) ?? 0) + 1);
          const pairs = intersection.get(key) ?? [];
          pairs.push([p1, p2]);
          intersection.set(key, pairs);
        }
      }
      const count = Math.max(...dist.values());
      if (count >= 12) {
        let key = "";
        intersection.forEach((v, k) => {
          if (v.length >= 12) {
            key = k;
            // p({k, l: v.length, s2: s2.id})
            // p(v)
          }
        });
        const [xo, yo, zo] = JSON.parse(key);
        s2.s = [xo, yo, zo];
        s2.b = ps2.map(([x, y, z]) => [x + xo, y + yo, z + zo]);
        break;
      }
    }
  }
}
const p1a = scanners.map((s) => s.b).flat().reduce((s, x) => {
  s.add(JSON.stringify(x));
  return s;
}, new Set());
const p2 = Math.max(
  ...scanners.map((s1) =>
    Math.max(
      ...scanners.filter((s2) => s1.id !== s2.id).map((s2) =>
        md(s1.s, s2.s)
      ),
    )
  ),
);
p({ p1: p1a.size, p2 });
console.timeEnd("a");
