const fs = require('fs')
const path = require('path')

class InputRow {

    constructor(row) {
        this.value = parseInt(row);
    }
}

class Day1 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        const result = this.dayInput
            .map((row) => row.value)
            .map((row) => this.calc(row))
            .reduce((prev, current) => prev + current, 0);
        return result;
    }
    calc(row){
        return Math.floor(row/3)-2;
    }
    calcWithCheck(value){
        const result = this.calc(value);
        return (result <= 0)?0:result;
    }

    part2() {

        const result = this.dayInput
            .map((row) => row.value)
            .map((row) => {
                const start = row;
                let mass = 0;
                let result = start;
                while (result != 0) {
                    result = this.calcWithCheck(result);
                    mass += result;
                }
                return mass;
            })
            .reduce((prev, current) => prev + current, 0);
        return result;

        
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day1(fileInput(file));
}

new Day1([{value:'12'}]);
new Day1([{ value:'1969'}]);
new Day1([{ value:'100756'}]);
day('data.input');
