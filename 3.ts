const p = console.log;
const raw = await Deno.readTextFile("3.txt");
const lines = raw.trim().split("\n");

const countOfOne: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

lines.forEach((line) => {
  line.split("").forEach((c, i) => {
    if (c === "1") countOfOne[i]++;
  });
});

const gb = countOfOne.map((c) => c > 500 ? "1" : "0").join("");
const eb = countOfOne.map((c) => c < 500 ? "1" : "0").join("");
p(parseInt(gb, 2) * parseInt(eb, 2));

const mcb = (lines: string[], pos: number) => {
  const countOne = lines.map((line) => line[pos]).filter((c) => c === "1");
  if (countOne.length >= (lines.length / 2)) {
    return lines.filter((line) => line[pos] === "1");
  } else {
    return lines.filter((line) => line[pos] === "0");
  }
};
const lcb = (lines: string[], pos: number) => {
  const countOne = lines.map((line) => line[pos]).filter((c) => c === "1");
  if (countOne.length >= (lines.length / 2)) {
    return lines.filter((line) => line[pos] === "0");
  } else {
    return lines.filter((line) => line[pos] === "1");
  }
};

let ox = lines.slice();
let counter = 0;
while (ox.length > 1) {
  ox = mcb(ox, counter);

  counter++;
}

counter = 0;
let co = lines.slice();
while (co.length > 1) {
  co = lcb(co, counter);
  counter++;
}
p(parseInt(ox[0], 2) * parseInt(co[0], 2));
