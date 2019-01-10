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
        // this.printMatrix();

        let start = {y:minY,x:500};

        this.waterCount = 0;
    
        // this.go(start.y, start.x);
        this.goDown(start.y, start.x);
        
        // this.printMatrix();
        this.writeMatrix(this.matrix)


        /* let point = start;
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
        } */

        return this.waterCount;
    }

    goDown(y,x){
        this.matrix[y][x] = '|';
        this.waterCount = this.waterCount + 1;
        this.printMatrix();
        if (y >= this.maxY) return 'end';


        //check next
        let nextDown = this.matrix[y+1][x];

        if (nextDown == '.') { //free space
            let downResult = this.goDown(y+1, x);
            if(downResult == 'blocked'){
                let leftResult;
                let nextLeft = this.matrix[y][x - 1];
                if (nextLeft == '.') { //free space
                    leftResult = this.goLeft(y, x - 1);
                } else if (nextLeft == '|') { //water
                    leftResult = 'otherWater';
                } else if (nextLeft == '#') {
                    leftResult = 'blocked';
                }

                let rightResult;
                let nextRight = this.matrix[y][x + 1];
                if (nextRight == '.') { //free space
                    rightResult = this.goRight(y, x + 1);
                } else if (nextRight == '|') { //water
                    rightResult = 'otherWater';
                } else if (nextRight == '#') {
                    rightResult = 'blocked';
                }
                if (leftResult == 'blocked' && rightResult == 'blocked') {
                    this.leftFillWater(y, x);
                    this.rightFillWater(y, x);
                    this.matrix[y][x] = '~';
                    this.printMatrix();
                    return 'blocked';
                }
            }
        } else if (nextDown == '|') { //water
            return 'otherWater';
        } else if(nextDown == '#') { //blocked
            let leftResult;
            let nextLeft = this.matrix[y][x - 1];
            if (nextLeft == '.') { //free space
                leftResult = this.goLeft(y, x-1);
            } else if (nextLeft == '|') { //water
                leftResult = 'otherWater';
            } else if (nextLeft == '#') {
                leftResult = 'blocked';
            }

            let rightResult;
            let nextRight = this.matrix[y][x + 1];
            if (nextRight == '.') { //free space
                rightResult = this.goRight(y, x + 1);
            } else if (nextRight == '|') { //water
                rightResult = 'otherWater';
            } else if (nextRight == '#') {
                rightResult = 'blocked';
            }
            if (leftResult == 'blocked' && rightResult == 'blocked'){
                this.leftFillWater(y,x);
                this.rightFillWater(y,x);
                this.matrix[y][x] = '~';
                this.printMatrix();
                return 'blocked';
            }

             /*let leftResult = this.go(y, x - 1);
            //try right
            let rightResult = this.go(y, x + 1);
            //if(leftResult == 'end' && rightResult == 'end') return 'end';
            if (leftResult == 'blocked' && rightResult == 'blocked') {
                return 'blocked'
            } else {
                return 'ok';
            } */
            // return 'blodked';
        }
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
    goLeft(y,x){
        this.matrix[y][x] = '|';
        this.waterCount = this.waterCount + 1;
        this.printMatrix();

        if (this.matrix[y+1][x] == '.'){
            let downResult = this.goDown(y+1,x);
            return downResult;
        }else{
            let nextLeft = this.matrix[y][x - 1];
            //sprawdza po czym idzie i czy może iść w dół, jak nie może to mówi, że dotarł do ściany
            let leftResult;
            if (nextLeft == '.') { //free space
                leftResult = this.goLeft(y, x - 1);
            } else if (nextLeft == '|') { //water
                leftResult = 'otherWater';
            } else if (nextLeft == '#') {
                leftResult = 'blocked';
            }
            return leftResult;
        }


    }
    goRight(y,x){
        this.matrix[y][x] = '|';
        this.waterCount = this.waterCount + 1;
        this.printMatrix();

        if (this.matrix[y + 1][x] == '.') {
            let downResult = this.goDown(y + 1, x);
            return downResult;
        } else {
            let nextRight = this.matrix[y][x + 1];
            //sprawdza po czym idzie i czy może iść w dół, jak nie może to mówi, że dotarł do ściany
            let rightResult;
            if (nextRight == '.') { //free space
                rightResult = this.goRight(y, x + 1);
            } else if (nextRight == '|') { //water
                rightResult = 'otherWater';
            } else if (nextRight == '#') {
                rightResult = 'blocked';
            }
            return rightResult;
        }
    }

    go(y, x) {
        if (y > this.maxY) return 'end';
        // if (this.matrix[y][x] == '|') return 'water';
        if (this.matrix[y][x] == '.') {
            this.matrix[y][x] = '|';
            this.waterCount = this.waterCount + 1;
            this.printMatrix();
            //try down
            let downResult = this.go(y + 1, x);
            if (downResult == 'end'){
                return 'end';
            }else if (downResult == 'blocked') {
                //if blocked
                //try left
                let leftResult = this.go(y, x - 1);
                //try right
                let rightResult = this.go(y, x + 1);
                //if(leftResult == 'end' && rightResult == 'end') return 'end';
                if (leftResult == 'blocked' && rightResult == 'blocked') {
                    return 'blocked'
                } else {
                    return 'ok';
                }
            } else {
                return 'ok';
            }
        } else {
            return 'blocked';
        }
    }

    part2() {
        for (let k = 0; k < this.dayInput.length; k++) {
            if (this.drawRect(k) == 0) {
                return this.dayInput[k].id;
            }
        }
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

// day('data2.input');
//day('data3.input');
day('data.input');
