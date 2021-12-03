const p = console.log;

const raw = await Deno.readTextFile("1.txt");
const lines = raw.trim().split("\n").map((e) => parseInt(e));
let prev;
let counter = 0;
for (const line of lines) {
  if (prev !== undefined && line > prev) counter++;
  prev = line;
}

p(counter);

let p2;
let counter2 = 0;

for (let i = 0; i < lines.length - 2; i++) {
  const curr = lines.slice(i, i + 3).reduce((a, b) => a + b, 0);
  if (p2 !== undefined && curr > p2) counter2++;
  p2 = curr;
}
p(counter2);
