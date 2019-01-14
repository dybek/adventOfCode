const fs = require('fs')
const path = require('path')


class InputRow {

    constructor(row) {
        let matched = /([xy])=(\d*),\s*([xy])=(\d*)..(\d*)/g.exec(row);
        this.cooridnateName = matched[1];
        this.cooridnate = parseInt(matched[2]);
        this.rangeCooridanteName = matched[3];
        this.rangeStart = parseInt(matched[4]);
        this.rangeEnd = parseInt(matched[5]);
    }
}

var left = { x: -1, y: 0 };
var right = { x: 1, y: 0 };
var up = { x: 0, y: -1 };
var down = { x: 0, y: 1 };

class Road{
    constructor(y,x, direction){
        this.from = {y,x}
        this.direction = direction;
    }
    next(){
        return{
            x: this.from.x + this.direction.x,
            y: this.from.y + this.direction.y
        }
    }

}

class Day {
    constructor(dayInput) {
        this.dayInput = dayInput;
        // console.log(this.part1());
        console.log(this.part2());
    }

    fillClayDeposit(inputRow){
        if (inputRow.cooridnateName == 'x'){
            this.fillY(inputRow);
        }else{
            this.fillX(inputRow);
        }
    }
    fillY(inputRow){
        let x = inputRow.cooridnate;
        for (let y = inputRow.rangeStart; y <= inputRow.rangeEnd; y++) {
            this.matrix[y][x] = '#';
        }
    }
    fillX(inputRow) {
        let y = inputRow.cooridnate;
        for (let x = inputRow.rangeStart; x <= inputRow.rangeEnd; x++) {
            this.matrix[y][x] = '#';
        }
    }

    part1() {
        const minX = Math.min(...this.dayInput
            .filter((row) => row.cooridnateName == 'x')
            .map((row) => row.cooridnate)
            .concat(this.dayInput
                .filter((row) => row.cooridnateName == 'y')
                .map((row) => row.rangeStart)));

        const minY = Math.min(...this.dayInput
            .filter((row) => row.cooridnateName == 'y')
            .map((row) => row.cooridnate)
            .concat(this.dayInput
                .filter((row) => row.cooridnateName == 'x')
                .map((row) => row.rangeStart)));

        const maxX = Math.max(...this.dayInput
            .filter((row) => row.cooridnateName == 'x')
            .map((row) => row.cooridnate)
            .concat(this.dayInput
                .filter((row) => row.cooridnateName == 'y')
                .map((row) => row.rangeEnd)));

        const maxY = Math.max(...this.dayInput
            .filter((row) => row.cooridnateName == 'y')
            .map((row) => row.cooridnate)
            .concat(this.dayInput
                .filter((row) => row.cooridnateName == 'x')
                .map((row) => row.rangeEnd)));

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;

        let matrix = [];
        for (let i = 0; i <= maxY; i++) {
            matrix[i] = [];
            for (let j = 0; j <= maxX+1; j++) {
                matrix[i][j] = '.';
            }
        }

        this.matrix = matrix;

        this.dayInput.forEach((input) => this.fillClayDeposit(input));

        

        let start = {y:minY,x:500};

        this.waterCount = 0;
    
        this.go(start.y, start.x, 'down');

        this.writeMatrix(this.matrix)

        return this.waterCount;
    }

    leftFillWater(y, x){
        let xIndex = x - 1;
        let element = this.matrix[y][xIndex];
        while (element == '|'){
            
            this.matrix[y][xIndex] = '~';
            xIndex = xIndex - 1;
            element = this.matrix[y][xIndex];
            this.printMatrix();
        }
    }
    rightFillWater(y, x){
        let xIndex = x + 1;
        let element = this.matrix[y][xIndex];
        while (element == '|') {

            this.matrix[y][xIndex] = '~';
            xIndex = xIndex + 1;
            element = this.matrix[y][xIndex];
            this.printMatrix();
        }
    }

    go(y, x, direction) {
        if (y > this.maxY) return 'end';
        if (this.matrix[y][x] == '|') return 'end';
        if (this.matrix[y][x] == '.') {
            this.matrix[y][x] = '|';
            this.waterCount = this.waterCount + 1;
            this.printMatrix();
            //try down
            let downResult = this.go(y + 1, x, 'down');
            if (downResult == 'end'){
                return 'end';
            }else{
                //if blocked
                //try left
                let leftResult 
                if(direction != 'right') leftResult = this.go(y, x - 1, 'left');
                //try right
                let rightResult 
                if (direction != 'left') rightResult = this.go(y, x + 1, 'right');
                if (leftResult == 'blocked' && rightResult == 'blocked') {
                    this.leftFillWater(y,x);
                    this.rightFillWater(y,x);
                    this.matrix[y][x] = '~';
                }
                if(leftResult == 'end') return 'end';
                if(rightResult == 'end') return 'end';
                return 'blocked'
            }
        } else {
            return 'blocked';
        }
    }

    part2() {
        let r1 = this.part1();
        let counter = 0;
        for (let i = 0; i <= this.maxY; i++) {
            for (let j = 0; j <= this. maxX + 1; j++) {
                if(this.matrix[i][j] == '~') counter++;
            }
        }
        return counter;
    }

    printMatrix(){
        this.printCount = (this.printCount + 1) | 0;
/*         this.matrix
            .filter((el,y) => y>=this.minY && y<=this.maxY)
            .map(row => row
                .filter((el, x) => x >= this.minX -1 && x <= this.maxX + 1)
                .join('')
            ).forEach(row => console.log(row)); */
        if (this.printCount == 15198){
            this.writeMatrix(this.matrix);
        }
    }

    writeMatrix(matrix) {
        const file = path.join(__dirname, 'result.txt');
        let data = this.matrix
            .filter((el, y) => y >= this.minY && y <= this.maxY)
            .map(row => row
                .filter((el, x) => x >= this.minX - 1 && x <= this.maxX + 1)
                .join('')
            ).join('\n');

        fs.writeFileSync(file, data, { encoding: 'utf-8' })
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

day('data2.input');
day('data.input');
