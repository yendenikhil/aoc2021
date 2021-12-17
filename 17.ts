// target area: x=288..330, y=-96..-50
const minx = 288;
const maxx = 330;
const miny = -96;
const maxy = -50;
/*
const minx = 20
const maxx = 30
const miny = -10
const maxy = -5
*/
const p = console.log;

const checkDropY = (y: number): [boolean, number, number, number[]] => {
  let posy = 0;
  let vely = y;
  let maxposy = 0;
  let step = 0;
  const steps = [];
  while (posy >= miny) {
    posy = posy + vely;
    vely--;
    maxposy = maxposy < posy ? posy : maxposy;
    step++;
    if (posy <= maxy && posy >= miny) {
      steps.push(step);
    }
    // if(y === 5) p({vely, posy, step})
  }
  // if(y === 9 || y === 10) p({y, steps, maxposy, posy})
  return [steps.length > 0, y, maxposy, steps];
};

console.time("a");
const rangey = [...Array(200).keys()].map((e) => e - 100);
const res1 = rangey.map(checkDropY)
  .filter((e) => e[0] === true);
res1.sort((a, b) => b[2] - a[2]);
p(res1[0]);
p(res1[0][2]);
console.timeLog("a");

const checkDropX = (x: number, steps: number[]): boolean => {
  let posx = 0;
  let velx = x;
  let step = 0;
  const maxstep = Math.max(...steps);
  while (step <= maxstep) {
    step++;
    posx = posx + velx;
    if (velx < 0) velx++;
    else if (velx > 0) velx--;
    // if (x ===7) p({x, posx, steps, step})
    if (posx >= minx && posx <= maxx && steps.includes(step)) {
      return true;
    }
  }
  return false;
};

const rangex = [...Array(662).keys()].map((e) => e - 331);
// const res2 = rangex.map(e => res1.filter(ee => checkDropX(e, ee[3])).length).reduce((a, b) => a + b)
const res2 = rangex.map((e) =>
  res1
    .filter((ee) => checkDropX(e, ee[3]))
    .map((ee) => {
      // if (e ===7) p({e, ee})
      return [e, ee[1]];
    }).length
).filter((e) => e > 0).reduce((a, b) => a + b);
// .filter(e => e.length > 0 )

p(res2);
console.timeEnd("a");
