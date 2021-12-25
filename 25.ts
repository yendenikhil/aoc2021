const p = console.log
const raw = await Deno.readTextFile('25.txt')
const lines = raw.trim().split('\n')
const graph = lines.map(line => line.split(''))

const stepRight = (input: string[][]): string[][] => {
  const rlen = input[0].length
  // step right
  return input.map(line => {
    const ll: string[] = line.slice()
    line.forEach((c, i) => {
      if (c === '>'){
      if (i === rlen - 1) {
        if (line[0] === '.') {
          ll[i] = '.'
          ll[0] = '>'
        }
      } else {
        if (line[i+1] === '.') {
          ll[i] = '.'
          ll[i+1] = '>'
        }
      }
      }
    })
      return ll
  })
}

const transform = (input: string[][]): string[][] => {
  return input[0].map((v, i) => input.map(row => row[i]).reverse())
}

const step = (input: string[][]): string[][] =>  {
  let res: string[][] = input.map(line => line.slice())
  // p({r0: res.map(line => line.join(''))})
  res = stepRight(res)
  // p({r1: res.map(line => line.join(''))})
  // transform CCW 90
  res = transform(transform(transform(res))).map(line => line.map(e => {
    if (e === ">") return "^"
    if (e === "v") return ">"
    return e
  }))
  // p({r2: res.map(line => line.join(''))})
  res = stepRight(res)
  // p({r3: res.map(line => line.join(''))})
  // transform CW 90
  res = transform(res).map(line => line.map(e => {
    if (e === ">") return "v"
    if (e === "^") return ">"
    return e
  }))
  // p({r4: res.map(line => line.join(''))})
  return res
}

let p1 = graph.map(line => line.slice())
let cnt = 0
while (true) {
  cnt++
  const res = step(p1)
  const match = p1.some((line, i) => line.join('') !== res[i].join(''))
  if(!match){
    p({cnt})
    break
  }
  p1 = res
}


