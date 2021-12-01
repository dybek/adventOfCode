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
        console.log("part 1", this.part1());
        console.log("part 2", this.part2());
    }

    part1() {
        return this.dayInput.map(el=>el.value).reduce((accu, current, currentIndex, array)=> {
            if (currentIndex === 0) return 0;
            const prevElement = array[currentIndex - 1];
            return (prevElement < current) ? accu+1 : accu;
        },0)
    }

    part2() {
        const values = this.dayInput.map(el=>el.value);
        const sums = [];
        for(let i=0;i<values.length-2;i++){
         sums.push(values[i]+values[i+1]+values[i+2]);
        }
        return sums.reduce((accu, current, currentIndex, array)=> {
            if (currentIndex === 0) return 0;
            const prevElement = array[currentIndex - 1];
            return (prevElement < current) ? accu+1 : accu;
        },0)
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

day('data.input');
day('data_test.input');
