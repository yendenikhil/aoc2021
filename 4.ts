const p = console.log;
const raw = await Deno.readTextFile("4.txt");
const lines = raw.trim().split("\n");
const numbers = lines[0].split(",").map((n) => parseInt(n));
let boardraw = [];
const boards = [];
const transpose = (rows: number[][]): number[][] => {
  const board: number[][] = [0, 1, 2, 3, 4].map((c) => rows.map((r) => r[c]));
  return board;
};

for (const line of lines.slice(2)) {
  if (line === "") {
    boards.push(boardraw);
    // boards.push(transpose(boardraw));
    boardraw = [];
  } else {
    boardraw.push(
      line.trim().replaceAll(/ +/g, ",").split(",").map((n) => parseInt(n)),
    );
  }
}
const winningboard = (board: number[][], curr: number[]) => {
  const t = transpose(board);
  return board.some((row) => row.every((e) => curr.includes(e))) ||
    t.some((row) => row.every((e) => curr.includes(e)));
  // const remBoard = board.filter(row => !row.every(e => curr.includes(e)))
  // if (remBoard.length < board.length) return remBoard
  // else return
};

const sum = (a: number, b: number) => a + b;
let found = false;

for (let i = 1; i <= numbers.length; i++) {
  const curr = numbers.slice(0, i);
  for (let j = 0; j < boards.length; j++) {
    const board = winningboard(boards[j], curr);
    if (board) {
      const last = curr[i - 1] ?? 0;
      p(
        last * boards[j]
          .map((row) =>
            row
              .filter((e) => !curr.includes(e))
              .reduce(sum, 0)
          )
          .reduce(sum, 0),
      );
      found = true;
      break;
    }
  }
  if (found) break;
}

const wonboards = [];
let lastCurr: number[] = [];
const wonset: Set<string> = new Set();

for (let i = 1; i <= numbers.length; i++) {
  const curr = numbers.slice(0, i);
  for (let j = 0; j < boards.length; j++) {
    if (wonset.has(JSON.stringify(boards[j]))) continue;
    const board = winningboard(boards[j], curr);
    if (board) {
      wonboards.push(boards[j]);
      wonset.add(JSON.stringify(boards[j]));
      lastCurr = curr;
    }
  }
}

const lastB = wonboards.pop();
const lastC = lastCurr[lastCurr.length - 1];
if (lastB && lastC) {
  p(
    lastC * lastB.map((row) =>
      row
        .filter((e) => !lastCurr.includes(e))
        .reduce(sum, 0)
    )
      .reduce(sum, 0),
  );
}
