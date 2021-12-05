const fs = require('fs')
const path = require('path')

class InputRow {

    constructor(row) {
        this.value = row;
    }
}

class DayX {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log("part1:", this.part1());
        console.log("part2:", this.part2());
    }

    part1() {

    }

    part2() {

    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new DayX(fileInput(file));
}

day('data.input');
day('data_test.input');
