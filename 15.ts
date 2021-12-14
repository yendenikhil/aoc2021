const p = console.log
const raw = await Deno.readTextFile('15.txt')
const lines = raw.trim().split('\n')
