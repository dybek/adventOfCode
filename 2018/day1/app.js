const fs = require('fs')


class InputRow {

    constructor(row) {
        let matched = /([-|+])(\d+)/g.exec(row);
        this.sign = matched[1];
        this.value = parseInt(matched[2]);
    }
}

class Day1 {
    constructor(day1input) {
        this.day1input = day1input;
        this.part1();
        console.log(this.part2());
    }

    part1() {
        const result = this.day1input
            .map((row) => row.sign == '-' ? -1 * row.value : row.value)
            .reduce((prev, current) => prev + current, 0);
        console.log(result);
    }

    part2() {
        const data = this.day1input
            .map((row) => row.sign == '-' ? -1 * row.value : row.value);
        let values = new Set();
        let value = 0;
        while (true) {
            for (let i = 0; i < data.length; i++) {
                let newValue = value + data[i];
                if (values.has(newValue)) {
                    return newValue;
                } else {
                    values.add(newValue);
                    value = newValue;
                }
            }
        }
    }

};

function fileInput(file){
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day1(fileInput(file));
}

day('data.input');
