const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        let matched = /(\d*), (\d*)/g.exec(row);
        this.x = parseInt(matched[1]);
        this.y = parseInt(matched[2]);
        this.infinitive = false;
        this.count = 0;
    }
}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        //console.log(this.part1());
        console.log(this.part2());
    }

    part1() {
        const minX = Math.min(...this.dayInput
            .map((row) => row.x));

        const maxX = Math.max(...this.dayInput
            .map((row) => row.x));

        const minY = Math.min(...this.dayInput
            .map((row) => row.y));

        const maxY = Math.max(...this.dayInput
            .map((row) => row.y));

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

        this.matrix = [];
        for (let i = minX - 10; i <= maxX + 10; i++) {
            this.matrix[i] = [];
            for (let j = minX - 10; j <= maxX + 10; j++) {
                let minIndexs = []
                let min = 100000000;
                for (let k = 0; k < this.dayInput.length; k++) {
                    let point = this.dayInput[k];
                    let distance = this.distance({ x: i, y: j }, point);
                    if (distance < min) {
                        minIndexs = [k];
                        min = distance;
                    } else if (distance == min) {
                        minIndexs.push(k);
                    }
                }
                if (minIndexs.length > 1) {
                    this.matrix[i][j] = -1;
                } else {
                    this.matrix[i][j] = minIndexs[0];
                }
            }
        }
        for (let i = minX; i <= maxX; i++) {
            for (let j = minX; j <= maxX; j++) {
                let name = this.matrix[i][j];
                if (name > -1) this.dayInput[name].count++;
            }
        }

        /* for (let j = minX - 1; j <= maxX + 1; j++) {
            let line = '';
            for (let i = minX - 1; i <= maxX + 1; i++) {
                if (this.matrix[i][j] == -1) {
                    line += '.';
                } else {
                    line += String.fromCharCode(65 + this.matrix[i][j]);
                }
            }
            console.log(line);
        } */

        this.findInfinitive();

        return Math.max(...this.dayInput
            .filter((row) => row.infinitive == false)
            .map(row => row.count));
    }

    distance(point1, point2) {
        return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
    }

    findInfinitive() {
        for (let i = this.minX - 10; i <= this.minX - 1; i++) {
            for (let j = this.minY - 1; j <= this.maxY + 1; j++) {
                let name = this.matrix[i][j];
                if (name > -1) this.dayInput[name].infinitive = true;
            }
        }
        for (let i = this.maxX + 1; i <= this.maxX + 10; i++) {
            for (let j = this.minY - 1; j <= this.maxY + 1; j++) {
                let name = this.matrix[i][j];
                if (name > -1) this.dayInput[name].infinitive = true;
            }
        }
        for (let i = this.minX - 1; i <= this.maxX + 1; i++) {
            for (let j = this.minY - 10; j <= this.minY - 1; j++) {
                let name = this.matrix[i][j];
                if (name > -1) this.dayInput[name].infinitive = true;
            }
        }
        for (let i = this.minX - 1; i <= this.maxX + 1; i++) {
            for (let j = this.maxY + 1; j <= this.maxY + 10; j++) {
                let name = this.matrix[i][j];
                if (name > -1) this.dayInput[name].infinitive = true;
            }
        }
    }


    part2() {
        const minX = Math.min(...this.dayInput
            .map((row) => row.x));

        const maxX = Math.max(...this.dayInput
            .map((row) => row.x));

        const minY = Math.min(...this.dayInput
            .map((row) => row.y));

        const maxY = Math.max(...this.dayInput
            .map((row) => row.y));

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;

        this.matrix = [];
        for (let i = minX - 10; i <= maxX + 10; i++) {
            this.matrix[i] = [];
            for (let j = minX - 10; j <= maxX + 10; j++) {
                //let minIndexs = []
                //let min = 100000000;

                let sum = 0;
                for (let k = 0; k < this.dayInput.length; k++) {
                    let point = this.dayInput[k];
                    let distance = this.distance({ x: i, y: j }, point);
                    sum += distance;
                }
                this.matrix[i][j] = sum;
                
            }
        }
        let count = 0
        for (let i = minX; i <= maxX; i++) {
            for (let j = minX; j <= maxX; j++) {
                if (this.matrix[i][j] < 10000) count ++
            }
        }
        return count;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file) {
    new Day(fileInput(file));
}

// day('data2.input');
day('data.input');
