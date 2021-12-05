const fs = require('fs')
const path = require('path')

class InputRow {

    constructor(row) {
        const result = /^(\w*)\s(\d*)$/g.exec(row);
        this.command = result[1];
        this.value = parseInt(result[2]);
    }
}

class Day2 {
    constructor(dayInput) {
        this.dayInput = dayInput;
        console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        const xy = [0,0];
        this.dayInput.forEach(row=>{
           if(row.command === 'up'){
               xy[1]-=row.value;
           }
            if(row.command === 'down'){
                xy[1]+=row.value;
            }
            if(row.command === 'forward'){
                xy[0]+=row.value;
            }
        });
        return xy[0]*xy[1];
    }

    part2() {
        const xy = [0,0];
        let aim = 0;
        this.dayInput.forEach(row=>{
            if(row.command === 'up'){
                aim-=row.value;
            }
            if(row.command === 'down'){
                aim+=row.value;
            }
            if(row.command === 'forward'){
                xy[0]+=row.value;
                xy[1]+=row.value*aim;
            }
        });
        return xy[0]*xy[1];
    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day2(fileInput(file));
}

day('data.input');
day('data_test.input');
