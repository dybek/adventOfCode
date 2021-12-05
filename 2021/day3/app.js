const fs = require("fs");
const path = require("path");

class Day3 {
  constructor(dayInput) {
    this.dayInput = dayInput;
    console.log("part1:", this.part1());
    console.log("part2:", this.part2());
  }

  findMostCommonBit(position) {
    return this.findMostCommonBitInList(position, this.dayInput);
  }

  findMostCommonBitInList(position, list) {
    const sum = list
      .map((row) => row[position])
      .map((el) => parseInt(el))
      .reduce((a, b) => a + b, 0);
    return sum > list.length / 2 ? "1" : "0";
  }

  findMostCommonBitInList2(position, list) {
    const sum = list
      .map((row) => row[position])
      .map((el) => parseInt(el))
      .reduce((a, b) => a + b, 0);
    if (sum > list.length / 2) return "1";
    if (sum < list.length / 2) return "0";
    if (sum == list.length / 2) return "1";
  }
  findLeastCommonBitInList2(position, list) {
    const sum = list
      .map((row) => row[position])
      .map((el) => parseInt(el))
      .reduce((a, b) => a + b, 0);
    if (sum > list.length / 2) return "0";
    if (sum < list.length / 2) return "1";
    if (sum == list.length / 2) return "0";
  }

  part1() {
    let gammaRate;
    let epsilonRate;

    const array = Array.from(this.dayInput[0]).map((el, i) =>
      this.findMostCommonBit(i)
    );
    gammaRate = parseInt(array.join(""), 2);
    epsilonRate = parseInt(
      array
        .map((el) => parseInt(el))
        .map((el) => !Boolean(el))
        .map((el) => (el ? "1" : "0"))
        .join(""),
      2
    );

    return gammaRate * epsilonRate;
  }

  part2() {
    let oxygenRate;
    let co2Rate;

    const maxLength = this.dayInput[0].length;
    let i = 0;
    let array = this.dayInput;
    do {
      const mostCommonBit = this.findMostCommonBitInList2(i, array);
      array = array.filter((el) => el[i] == mostCommonBit);
      i++;
    } while (i < maxLength);
    oxygenRate = parseInt(array.join(""), 2);

    i = 0;
    array = this.dayInput;
    do {
      const mostCommonBit = this.findLeastCommonBitInList2(i, array);
      array = array.filter((el) => el[i] == mostCommonBit);
      i++;
    } while (i < maxLength && array.length > 1);
    co2Rate = parseInt(array.join(""), 2);

    return oxygenRate * co2Rate;
  }
}

function fileInput(fileName) {
  const file = path.join(__dirname, fileName);
  return fs.readFileSync(file, { encoding: "utf-8" }).split("\n");
}
function day(file) {
  new Day3(fileInput(file));
}

day("data.input");
day("data_test.input");
