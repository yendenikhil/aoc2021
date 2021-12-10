const p = console.log;
const raw = await Deno.readTextFile("10.txt");
const lines = raw.trim().split("\n");
const scores = new Map();
scores.set(")", 3);
scores.set("]", 57);
scores.set("}", 1197);
scores.set(">", 25137);
const comScores = new Map();
comScores.set("(", 1);
comScores.set("[", 2);
comScores.set("{", 3);
comScores.set("<", 4);

const p1 = lines.map((line) => {
  const stack: string[] = [];
  let score = 0;
  for (const c of line.split("")) {
    if (c.search(/(\(|\[|\{|\<)/) > -1) {
      stack.push(c);
    } else if (c.search(/(\)|\]|\}|\>)/) > -1) {
      const prev = stack.pop();
      // p({prev, c})
      if (!prev) {
        break; // incomplete
      } else {
        if ((prev + c).search(/(\(\)|\[\]|\{\}|\<\>)/) === -1) {
          score = scores.get(c) ?? 0;
          break;
        }
      }
    } else {
      p("ERROR");
      p(c);
    }
  }
  return score;
});

p(p1.reduce((a, b) => a + b));

const ss = ["{<[[]]>}<{[{[{[]{()[[[]"];
const p2 = lines.map((line) => {
  const stack: string[] = [];
  let score = 0;
  for (const c of line.split("")) {
    if (c.search(/(\(|\[|\{|\<)/) > -1) {
      stack.push(c);
    } else if (c.search(/(\)|\]|\}|\>)/) > -1) {
      const prev = stack.pop();
      // p({prev, c})
      if (!prev) {
        break; // incomplete
      } else {
        if ((prev + c).search(/(\(\)|\[\]|\{\}|\<\>)/) === -1) {
          score = score === 0 ? (scores.get(c) ?? 0) : score;
          break;
        }
      }
    } else {
      p("ERROR");
      p(c);
    }
  }
  let comp = 0;
  if (score === 0) {
    while (stack.length > 0) {
      const cc = stack.pop();
      if (cc) {
        const toadd = comScores.get(cc) ?? 0;
        comp = 5 * comp + toadd;
        // p({cc, comp, toadd})
      }
    }
  }
  return comp;
}).filter((e) => e > 0);
p2.sort((a, b) => a - b);
const mid = (p2.length - 1) / 2;
p(p2[mid]);
