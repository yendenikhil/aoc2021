const p = console.log;

const adder = (a: number, b: number) => a + b;

class Dice {
  count: number;
  constructor(count = 0) {
    this.count = count;
  }

  next(): number {
    const val = [1, 2, 3]
      .map((e) => this.count + e)
      .map((e) => e > 100 ? e - 100 : e)
      .reduce(adder);
    this.count += 3;
    return val;
  }
}

type QD = {
  v: number;
  mult: number;
};
const nextQ = (mult = 1): QD[] => {
  //  return "111,112,113,121,122,123,131,132,133,211,212,213,221,222,223,231,232,233,311,312,313,321,322,323,331,332,333"
  //  .split(",")
  //  .map((arr) => arr.split("").map(Number).reduce(adder))
  return [
    { v: 3, mult: mult * 1 },
    { v: 4, mult: mult * 3 },
    { v: 5, mult: mult * 6 },
    { v: 6, mult: mult * 7 },
    { v: 7, mult: mult * 6 },
    { v: 8, mult: mult * 3 },
    { v: 9, mult: mult * 1 },
  ];
};

class Player {
  pos: number;
  score: number;
  winscore: number;
  constructor(pos: number, winscore: number, score = 0) {
    this.pos = pos;
    this.score = score;
    this.winscore = winscore;
  }
  turn(val: number): void {
    // lets make this 0 indexed so we can use modulo op
    this.pos = ((this.pos + val - 1) % 10) + 1;
    this.score += this.pos;
  }
  notFinished(): boolean {
    return this.score < this.winscore;
  }
}

const solve1 = (a: number, b: number) => {
  const p1 = new Player(a, 1000);
  const p2 = new Player(b, 1000);
  const d = new Dice();

  while (true) {
    p1.turn(d.next());
    if (!p1.notFinished()) break;
    p2.turn(d.next());
    if (!p2.notFinished()) break;
  }
  // p({ p1, p2, d });
  const loss = p1.score >= 1000 ? p2.score : p1.score;
  p(loss * d.count);
};

type Q = {
  val: QD;
  p1: Player;
  p2: Player;
  isP1: boolean;
};
const solve2 = (a: number, b: number) => {
  let p1 = new Player(a, 21, 0);
  let p2 = new Player(b, 21, 0);
  const queue: Q[] = nextQ().map((d) => {
    return {
      val: d,
      p1: new Player(p1.pos, 21, p1.score),
      p2: new Player(p2.pos, 21, p2.score),
      isP1: true,
    };
  });
  let w1 = 0;
  let w2 = 0;
  let counter = 0;
  while (queue.length > 0) {
    counter++;
    const curr = queue.pop();
    if (curr === undefined) break;
    let { val, p1, p2 } = curr;
    if (curr.isP1) {
      p1.turn(val.v);
      // p({curr, p1, isP1, counter})
      if (!p1.notFinished()) {
        w1 += val.mult;
        continue;
      }
    } else {
      p2.turn(val.v);
      // p({curr, p2, isP1, counter})
      if (!p2.notFinished()) {
        w2 += val.mult;
        continue;
      }
    }
    // if (counter % 1000000 === 0)
    // p({counter, q: queue.length, curr, w1, w2})
    curr.isP1 = !curr.isP1;
    queue.push(
      ...nextQ(val.mult).map((d) => {
        return {
          val: d,
          p1: new Player(p1.pos, 21, p1.score),
          p2: new Player(p2.pos, 21, p2.score),
          isP1: curr.isP1,
        };
      }),
    );
  }
  p(w1 > w2 ? w1 : w2);
};

console.time("a");
solve1(5, 9);
console.timeLog("a");
solve2(5, 9);
console.timeEnd("a");
