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
        console.log(this.part1());
        // console.log(this.part2());
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
            for (let j = 0; j <= maxX; j++) {
                matrix[i][j] = '.';
            }
        }

        this.matrix = matrix;

        this.dayInput.forEach((input) => this.fillClayDeposit(input));

        /* 
        for (let k = 0; k < this.dayInput.length; k++) {
            let pattern = this.dayInput[k];
            for (let i = 0; i < pattern.xSize; i++) {
                for (let j = 0; j < pattern.ySize; j++) {
                    matrix[pattern.x + i][pattern.y + j]++;
                }
            }
        }

        for (let i = 0; i < maxX; i++) {
            for (let j = 0; j < maxY; j++) {
                if (matrix[i][j] > 1) count++;
            }
        } */
        this.printMatrix();

        let start = {y:0,x:500};
        
        let point = start;
        this.matrix[point.y][point.x] = {type:'water'};
        this.matrix[point.y][point.x].before = null;
        let last = this.matrix[point.y][point.x];
        function go(y,x,last){

        }
        if(this.matrix[point.y-1][point.x] == '.'){
            //go down
        } else if (this.matrix[point.y - 1][point.x].type == 'water') {
            //blind road
            //connect with other road
        } else if (this.matrix[point.y - 1][point.x].type == '#') {
            //try go left
            //try go right
        }

        let roads = [];
        roads.push(new Road(0,500,down))
        while(roads.length > 0){
            for(let road of roads){
                //make a move
                    //go down if possible
                    
                    //go left and right, or check if can be filled

                    //back to before step
            }
        }

        let count = 0;
        return count;
    }

    go(y,x,last){
        
    }

    part2() {
        for (let k = 0; k < this.dayInput.length; k++) {
            if (this.drawRect(k) == 0) {
                return this.dayInput[k].id;
            }
        }
    }

    printMatrix(){
        this.matrix
            .filter((el,y) => y>=this.minY && y<=this.maxY)
            .map(row => row
                .filter((el, x) => x >= this.minX -1 && x <= this.maxX + 1)
                .join('')
            ).forEach(row => console.log(row))
    }

    drawRect(skip) {
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
            if (k == skip) continue;
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
//day('data3.input');
day('data.input');
