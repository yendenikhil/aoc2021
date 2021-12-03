const p = console.log;
const raw = await Deno.readTextFile("2.txt");
const lines = raw.trim().split("\n");

let x = 0;
let depth = 0;

lines.forEach((line) => {
  const [op, dist] = line.split(" ");
  if (op === "forward") x += parseInt(dist);
  else if (op === "down") depth += parseInt(dist);
  else depth -= parseInt(dist);
});
p(x * depth);

x = 0;
depth = 0;
let aim = 0;

lines.forEach((line) => {
  const [op, dist] = line.split(" ");
  if (op === "forward") {
    x += parseInt(dist);
    depth += aim * parseInt(dist);
  } else if (op === "down") aim += parseInt(dist);
  else aim -= parseInt(dist);
});
p(x * depth);
