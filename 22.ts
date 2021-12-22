const p = console.log;
const raw = await Deno.readTextFile("22.txt");
const lines = raw.trim().split("\n");

type Pos = [number, number, number];

class Instr {
  on: boolean;
  min: Pos;
  max: Pos;
  constructor(on: boolean, min: Pos, max: Pos) {
    this.on = on;
    this.min = min;
    this.max = max;
  }

  static parse(line: String): Instr {
    const m = line.match(/(^\w+|-?\d+)/g);
    if (m) {
      const on = m[0] === "on";
      const min = [Number(m[1]), Number(m[3]), Number(m[5])] as Pos;
      const max = [Number(m[2]), Number(m[4]), Number(m[6])] as Pos;
      return new Instr(on, min, max);
    } else {
      throw new Error("Something wrong");
    }
  }

  static bounds(i: Instr, min: number, max: number): boolean {
    const [x1, y1, z1] = i.min;
    const [x2, y2, z2] = i.max;
    return x1 >= min && y1 >= min && z1 >= min && x2 <= max && y2 <= max &&
      z2 <= max;
  }

  exclusion(i: Instr): Instr | undefined {
    const [x1, y1, z1] = this.min;
    const [x2, y2, z2] = this.max;
    const [x3, y3, z3] = i.min;
    const [x4, y4, z4] = i.max;
    const xmin = x1 > x3 ? x1 : x3;
    const ymin = y1 > y3 ? y1 : y3;
    const zmin = z1 > z3 ? z1 : z3;
    const xmax = x2 > x4 ? x4 : x2;
    const ymax = y2 > y4 ? y4 : y2;
    const zmax = z2 > z4 ? z4 : z2;
    if (xmax < xmin || ymax < ymin || zmax < zmin) {
      return;
    }
    return new Instr(!this.on, [xmin, ymin, zmin], [xmax, ymax, zmax]);
  }
}

const instr: Instr[] = lines.map(Instr.parse);
const solve = (instr: Instr[]) => {
  const p1: Instr[] = [];
  instr
    .forEach((i) => {
      const exc = p1.map((e) => e.exclusion(i)).filter((e) => e !== undefined);
      if (i.on) {
        p1.push(i);
      }
      exc.forEach((e) => {
        if (e) p1.push(e);
      });
    });
  const count = ([x1, y1, z1]: Pos, [x2, y2, z2]: Pos): number =>
    (x2 - x1 + 1) * (y2 - y1 + 1) * (z2 - z1 + 1);
  const adder = (a: number, b: number): number => a + b;
  const p1c = p1.map((e) => count(e.min, e.max) * (e.on ? 1 : -1));
  p(p1c.reduce(adder));
};
console.time("a");
solve(instr.filter((e) => Instr.bounds(e, -50, 50)));
console.timeLog("a");
solve(instr);
console.timeEnd("a");
