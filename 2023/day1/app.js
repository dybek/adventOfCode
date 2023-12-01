const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.value = row;
    }
}

const letters = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9
}

class Day1 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log("part 1", this.part1());
        console.log("part 2", this.part2());
    }

    part1() {
        return this.dayInput.map(el => el.value).map(line => {
            let i = 0;
            let first;
            let last;
            while (i < line.length) {
                const current = parseInt(line[i]);
                if (!isNaN(current)) {
                    first = current;
                    break;
                }
                i++;
            }
            i = line.length - 1;
            while (i >= 0) {
                const current = parseInt(line[i]);
                if (!isNaN(current)) {
                    last = current;
                    break;
                }
                i--;
            }
            return first * 10 + last;
        })
            .reduce((sum, current) => sum + current, 0);
    }

    part2() {
        return this.dayInput.map(el => el.value).map(line => {
            let first = this.findFirstLetter(line);
            let last = this.findLastLetter(line);

            return first * 10 + last;
        })
            .reduce((sum, current) => sum + current, 0);
    }

    findFirstLetter(row) {
        const rs = row.match(/.*?(\d|zero|one|two|three|four|five|six|seven|eight|nine).*/);
        if (isNaN(parseInt(rs[1]))) {
            return letters[rs[1]];
        } else {
            return parseInt(rs[1]);
        }
    }

    findLastLetter(row) {
        const rs = row.match(/.*(\d|zero|one|two|three|four|five|six|seven|eight|nine).*/);
        if (isNaN(parseInt(rs[1]))) {
            return letters[rs[1]];
        } else {
            return parseInt(rs[1]);
        }
    }

};


function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, {encoding: 'utf-8'})
        .split('\n')
        .map(row => new InputRow(row));
}

function day(file) {
    new Day1(fileInput(file));
}

day('data_test.input');
day('data_test2.input');
day('data.input');
