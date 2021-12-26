const p = console.log
const raw = await Deno.readTextFile('24.txt')
const opcodes: string[][] = raw.trim().split('\n').map(line => line.split(' '))
const aa = [...Array(opcodes.length).keys()].map((e, i) => {
    if ([4, 5, 15].includes(i % 18)) return Number(opcodes[i][2])
    else undefined
}).filter(e => e !== undefined)
for(let i = 0; i < aa.length - 2; i+= 3) {
  const [a, b, c] = aa.slice(i, i+4)
  p({i: i/3, a,b,c})
}


/*
--- b > 9 a = 1
w = input
x = 1
z *= 26
z += w+c

--- a = 26 
w = input
x = ((z % 26) + b) === w ? 0 : 1 => x = w_old + c_old + b
z //= 26
y = x === 0 ? 1 : 26
z *= 25*x + 1
y = (w + c) * x
z += (w+c)*x

in0 = in13
in1 - 7 = in12
in2 + 5 = in11
in3 + 7 = in6
in4 - 2 = in5
in7 + 4 = in8
in9 - 6 = in10

0 0 0 0 0 0 0 0 0 0 1 1 1 1
0 1 2 3 4 5 6 7 8 9 0 1 2 3

p1
9 9 4 2 9 7 9 5 9 9 3 9 2 9
99429795993929
p2
1 8 1 1 3 1 8 1 5 7 1 6 1 1
18113181571611

*/
