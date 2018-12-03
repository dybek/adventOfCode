const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        let matched = /#(\d*) @ (\d*),(\d*): (\d*)x(\d*)/g.exec(row);
        this.id = matched[1];
        this.x = parseInt(matched[2]);
        this.y = parseInt(matched[3]);
        this.xSize = parseInt(matched[4]);
        this.ySize = parseInt(matched[5]);
    }    
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        //console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        const maxX = Math.max(...this.dayInput
            .map((row) => row.x)) + Math.max(...this.dayInput
            .map((row) => row.xSize));

        const maxY = Math.max(...this.dayInput
            .map((row) => row.y)) + Math.max(...this.dayInput
                .map((row) => row.ySize));
        
        let matrix = [];
        for (let i = 0; i < maxX; i++) {
            matrix[i] = [];
            for (let j = 0; j < maxY; j++) {
                matrix[i][j] = 0;
            }
        }

        for (let k = 0; k < this.dayInput.length; k++) {
            let pattern = this.dayInput[k];
            for (let i = 0; i < pattern.xSize; i++) {
                for (let j = 0; j < pattern.ySize; j++) {
                    matrix[pattern.x + i][pattern.y + j]++;
                }
            }
        }

        let count = 0;
        for (let i = 0; i < maxX; i++) {
            for (let j = 0; j < maxY; j++) {
                if(matrix[i][j] >1) count++;
            }
        }
        return count;
    }

    part2() {
        for (let k = 0; k < this.dayInput.length; k++) {
            if(this.drawRect(k) == 0){
                return this.dayInput[k].id;
            }
        }
    }

    drawRect(skip){
        const maxX = Math.max(...this.dayInput
            .map((row) => row.x)) + Math.max(...this.dayInput
                .map((row) => row.xSize));

        const maxY = Math.max(...this.dayInput
            .map((row) => row.y)) + Math.max(...this.dayInput
                .map((row) => row.ySize));

        let matrix = [];
        for (let i = 0; i < maxX; i++) {
            matrix[i] = [];
            for (let j = 0; j < maxY; j++) {
                matrix[i][j] = 0;
            }
        }

        for (let k = 0; k < this.dayInput.length; k++) {
            let pattern = this.dayInput[k];
            if(k == skip) continue;
            for (let i = 0; i < pattern.xSize; i++) {
                for (let j = 0; j < pattern.ySize; j++) {
                    matrix[pattern.x + i][pattern.y + j]++;
                }
            }
        }

        let pattern = this.dayInput[skip];
        let count = 0;
        for (let i = 0; i < pattern.xSize; i++) {
            for (let j = 0; j < pattern.ySize; j++) {
                count += matrix[pattern.x + i][pattern.y + j];
            }
        }
        return count;

    }

};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day(fileInput(file));
}

day('data2.input');
//day('data3.input');
day('data.input');
