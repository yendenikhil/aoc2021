const p = console.log;
const raw = await Deno.readTextFile("16.txt");

// p(parseInt('A', 16).toString(2).padStart(4, '0'))
// const input = "D2FE28"
// const input = "EE00D40C823060";
// const input = "8A004A801A8002F478";
// const input = "620080001611562C8802118E34";
const input = raw.trim();
let sumVersions = 0;
const bits = input.split("").map((e) =>
  parseInt(e, 16).toString(2).padStart(4, "0")
).join("");

const calcOnTypeId = (typeId: number, arr: number[]) => {
  switch (typeId) {
    case 0: {
      return arr.reduce((a, b) => a + b);
    }
    case 1: {
      return arr.reduce((a, b) => a * b);
    }
    case 2: {
      return Math.min(...arr);
    }
    case 3: {
      return Math.max(...arr);
    }
    case 5: {
      return arr[0] > arr[1] ? 1 : 0;
    }
    case 6: {
      return arr[0] < arr[1] ? 1 : 0;
    }
    case 7: {
      return arr[0] === arr[1] ? 1 : 0;
    }
    default: {
      p("ERROR");
      return -1;
    }
  }
};

const parsePacket = (bits: string) => {
  // p({bits})
  const version = parseInt(bits.slice(0, 3), 2);
  const typeId = parseInt(bits.slice(3, 6), 2);
  sumVersions += version;

  if (typeId === 4) {
    let num2 = "";
    let index = 0;
    for (let i = 6; i < bits.length; i += 5) {
      const n = bits.slice(i + 1, i + 5);
      if (bits.length - 1 - i < 5 && n.search(/0+/) > -1) break;
      num2 += n;
      if (bits.slice(i, i + 1) === "0") {
        index = i + 5;
        break;
      }
    }
    // p(parseInt(num2, 2));
    // p({index, version, typeId})
    return [index, parseInt(num2, 2)];
  } else {
    const lengthTypeId = bits.slice(6, 7);
    // p({ lengthTypeId });
    if (lengthTypeId === "0") {
      const totalLengthInBits = parseInt(bits.slice(7, 22), 2);
      // p({ totalLengthInBits });
      const start = 22;
      let newIndex = 22;
      const arr: number[] = [];
      while (start + totalLengthInBits > newIndex) {
        const [ii, vv] = parsePacket(bits.slice(newIndex));
        arr.push(vv);
        newIndex += ii;
      }
      const val = calcOnTypeId(typeId, arr);
      // p({newIndex, version, typeId})
      return [newIndex, val];
    } else {
      const numerOfSubpackets = parseInt(bits.slice(7, 18), 2);
      // p({ numerOfSubpackets });
      let newIndex = 18;
      const arr: number[] = [];
      for (let i = 0; i < numerOfSubpackets; i++) {
        const [ii, vv] = parsePacket(bits.slice(newIndex));
        arr.push(vv);
        newIndex += ii;
      }
      const val = calcOnTypeId(typeId, arr);
      // p({newIndex, version, typeId})
      return [newIndex, val];
    }
  }
};

console.time("a");
p({ p2: parsePacket(bits)[1] });
p({ p1: sumVersions });
console.timeEnd("a");
