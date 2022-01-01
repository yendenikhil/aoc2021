const p = console.log;
const raw = await Deno.readTextFile("19.1.txt");
type Pos = [number, number, number];

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
}

const comparePosition = (p1: Pos[], p2: Pos[]): number => {
  // p({p1, p2})
  let max = 0;
  for (let i = 0; i < p1.length; i++) {
    const [dx1, dy1, dz1] = p1[i];
    for (let j = 0; j < p2.length; j++) {
      const [dx2, dy2, dz2] = p2[j];
      const shifted1: string[] = p1.map((
        [ddx, ddy, ddz],
      ) => [ddx - dx1, ddy - dy1, ddz - dz1]).map((e) => JSON.stringify(e));
      const shifted2: string[] = p2.map((
        [ddx, ddy, ddz],
      ) => [ddx - dx2, ddy - dy2, ddz - dz2]).map((e) => JSON.stringify(e));
      const count = shifted1.filter((e) => shifted2.includes(e)).length;
      max = max > count ? max : count;
      // p({ max, count });
      // p({shifted1, shifted2})
    }
  }

  return max;
};

const scanners: Scanner[] = raw.trim().split("\n\n").map((block) =>
  block.split("\n")
).map((lines) => new Scanner(lines));
scanners[0].s = [0, 0, 0];
// p(scanners)
scanners[1].bb.map(bb => comparePosition(scanners[0].b, bb))
          .forEach((e, i) => p({i, e}))
