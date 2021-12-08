const p = console.log;
const raw = await Deno.readTextFile("8.txt");
const lines = raw.trim().split("\n");

const output = lines.map((line) => line.split(" | ")[1].split(" "));
const p1 = output.map((line) =>
  line.filter((e) =>
    e.length === 2 || e.length === 3 || e.length === 4 || e.length === 7
  ).length
).reduce((a, b) => a + b);
p(p1);

const eq = lines.map((line) => line.split(" | ")).map((
  [left, right],
) => [left.split(" "), right.split(" ")]);

const findDigits = (input: string[]): Map<string, number> => {
  const one = input.find((e) => e.length === 2)?.split("") || [""];
  const four = input.find((e) => e.length === 4)?.split("") || [""];
  const seven = input.find((e) => e.length === 3)?.split("") || [""];
  const eight = input.find((e) => e.length === 7)?.split("") || [""];
  const three =
    input.find((e) =>
      e.length === 5 && seven.every((ee) => e.split("").includes(ee))
    )?.split("") || [""];
  const nine =
    input.find((e) =>
      e.length === 6 && three.every((ee) => e.split("").includes(ee)) &&
      seven.every((ee) => e.split("").includes(ee))
    )?.split("") || [""];
  const zero =
    input.find((e) =>
      e.length === 6 && seven.every((ee) => e.split("").includes(ee)) &&
      e !== nine.join("")
    )?.split("") || [""];
  const six =
    input.find((e) =>
      e.length === 6 && nine.join("") !== e && zero.join("") !== e
    )?.split("") || [""];
  const five =
    input.find((e) =>
      e.length === 5 && e.split("").every((ee) => six.includes(ee))
    )?.split("") || [""];
  const two =
    input.find((e) =>
      e.length === 5 && three.join("") !== e && five.join("") !== e
    )?.split("") || [""];
  const map: Map<string, number> = new Map();
  map.set(zero.join(""), 0);
  map.set(one.join(""), 1);
  map.set(two.join(""), 2);
  map.set(three.join(""), 3);
  map.set(four.join(""), 4);
  map.set(five.join(""), 5);
  map.set(six.join(""), 6);
  map.set(seven.join(""), 7);
  map.set(eight.join(""), 8);
  map.set(nine.join(""), 9);
  return map;
};

const p2 = eq.map(([left, right]) => {
  const m = findDigits(left);
  const splitLeft = left.map((e) => e.split(""));
  const splitRight = right.map((e) => e.split(""));
  const corrRight = splitRight.map((r) =>
    splitLeft.find((l) =>
      l.every((ee) => r.includes(ee)) && r.every((ee) => l.includes(ee))
    ) ?? [""]
  ).map((e) => e.join(""));
  const [a1, a2, a3, a4] = corrRight.map((e) => m.get(e) ?? 0);
  const number = a1 * 1000 + a2 * 100 + a3 * 10 + a4;
  if (number === 0) p({ left, right, m });
  return number;
}).reduce((a, b) => a + b);
p(p2);
