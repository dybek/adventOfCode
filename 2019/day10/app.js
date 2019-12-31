const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.value = row;
    }
}

class Day10 {
    constructor(dayInput) {
        this.dayInput = dayInput.map(row=>row.value);
        // console.log(this.part1());
        console.log(this.part2());
    }
    createMatrix(input){
        let matrix = [];
        for (let y = 0; y < input.length; y++) {
            matrix[y] = Array.from(input[y]).map(element=>{
                return {
                    element,
                    count:0,
                    asteroids:[]
                }
            });
        }
        return matrix;
    }

    isSometingOnLine(beginPoint, endPoint){
        let sometingOnLine = false;
        if(beginPoint.x == endPoint.x){
            if(beginPoint.y > endPoint.y){
                let tmp = beginPoint;
                beginPoint = endPoint;
                endPoint = tmp;
            }
            for (let y = beginPoint.y+1; y < endPoint.y; y++) {
                let matrixElement = this.getElement(beginPoint.x,y);
                if(matrixElement.element == '#'){
                    sometingOnLine = true;
                    break;
                }
            }
        }else{
            if(beginPoint.x > endPoint.x){
                let tmp = beginPoint;
                beginPoint = endPoint;
                endPoint = tmp;
            }
            for (let x = beginPoint.x+1; x < endPoint.x; x++) {
                let y = this.pointOnLine(x, beginPoint, endPoint);
                if(Number.isInteger(y)){
                    let matrixElement = this.getElement(x, y);
                    if (matrixElement.element == '#') {
                        sometingOnLine = true;
                        break;
                    }
                }
            }
        }
        return sometingOnLine;
    }
    pointOnLine(x, beginPoint, endPoint){
        return (((endPoint.y-beginPoint.y)*(x-beginPoint.x))/(endPoint.x-beginPoint.x))+beginPoint.y;
    }

    getElement(x,y){
        return this.matrix[x][y];
    }
    setElement(x,y,element){
        this.matrix[x][y] = element;
    }

    countAsteroidsInSight(){
        const matrix = this.matrix;
        for (let x = 0; x < matrix.length; x++) {
            const row = matrix[x];
            for (let y = 0; y < row.length; y++) {
                if (row[y].element == '#'){
                    row[y].count = this.countAsteroidsFromPoint(x,y);
                }
            }
        }
    }

    countAsteroidsFromPoint(x2,y2){
        let count = 0;
        const matrix = this.matrix;
        for (let x = 0; x < matrix.length; x++) {
            const row = matrix[x];
            for (let y = 0; y < row.length; y++) {
                if (row[y].element == '#') {
                    if(x2 != x || y2 != y){
                        if(!this.isSometingOnLine({x,y},{x:x2,y:y2})){
                            this.matrix[x2][y2].asteroids.push({x,y})
                            count++;
                        }
                    }
                }
            }
        }
        return count;
    }

    printMatrix(matrix){
       /*  const tempMatrix = [];
        const firstElement = matrix[0];

        for (let y = 0; y < firstElement.length; y++) {
            tempMatrix[y]=[];
            for (let x = 0; x < matrix.length; x++) {
                tempMatrix[y][x] = matrix[x][y];
            } 

        } */
        matrix.forEach(line=>console.log(
            line.map(el=>el.element == '#'?el.element:el.element)
                .join('')
        ));
    }

    angle(center, point){
        const newPoint = { x: point.y - center.y, y: -1 * point.x + center.x}
        point.newX = newPoint.x;
        point.newY = newPoint.y;
        const angle = calcAngleDegrees(newPoint.x, newPoint.y);
/*         let angle = 0;
        if (Math.sign(newPoint.y) >= 0 && Math.sign(newPoint.x) >= 0){
            angle += 0;
        } else if (Math.sign(newPoint.y) >= 0 && Math.sign(newPoint.x) <= 0) {
            // angle += Math.PI/2;
            angle += 0;
        } else if (Math.sign(newPoint.y) <= 0 && Math.sign(newPoint.x) <= 0) {
            angle += Math.PI;
        } else if (Math.sign(newPoint.y) <= 0 && Math.sign(newPoint.x) >= 0) {
            angle += Math.PI;
            // angle += Math.PI*1.5;
        }

        angle += Math.asin(newPoint.y / Math.sqrt(Math.pow(newPoint.x,2) + Math.pow(newPoint.y,2))); */
        return angle;
    }

    part1() {
        this.matrix = this.createMatrix(this.dayInput);
        this.countAsteroidsInSight();
        this.printMatrix(this.matrix);

        let maxPoint;
        let maxCount = 0;

        const matrix = this.matrix;
        for (let x = 0; x < matrix.length; x++) {
            const row = matrix[x];
            for (let y = 0; y < row.length; y++) {
                if(row[y].count > maxCount){
                    maxCount = row[y].count;
                    maxPoint = {x,y};
                }
            }
        }

        return maxCount;
    }

    part2() {
        this.matrix = this.createMatrix(this.dayInput);
        this.countAsteroidsInSight();
        this.printMatrix(this.matrix);

        let maxPoint;
        let maxCount = 0;

        const matrix = this.matrix;
        for (let x = 0; x < matrix.length; x++) {
            const row = matrix[x];
            for (let y = 0; y < row.length; y++) {
                if (row[y].count > maxCount) {
                    maxCount = row[y].count;
                    maxPoint = { x, y };
                }
            }
        }

        let station = this.matrix[maxPoint.x][maxPoint.y];
        station.x = maxPoint.x;
        station.y = maxPoint.y;
        let asteroids = station.asteroids;
        for (let index = 0; index < asteroids.length; index++) {
            const asteroid = asteroids[index];
            asteroid.angle = this.angle(station, asteroid);
        }
        asteroids.sort((a,b)=>a.angle-b.angle);
        
        let count = 0;
        let found = false;
        let foundElement;
        do{
            while (asteroids.length >0) {
                let ast= asteroids.shift();
                this.matrix[ast.x][ast.y].element='.';
                count++;
                console.log(count, ast.x, ast.y);
                if(count == 200){
                    found = true;
                    foundElement = ast;
                    break;
                }
            }
            this.countAsteroidsFromPoint(station.x, station.y);
            asteroids = station.asteroids;
            for (let index = 0; index < asteroids.length; index++) {
                const asteroid = asteroids[index];
                asteroid.angle = this.angle(station, asteroid);
            }
            asteroids.sort((a, b) => a.angle - b.angle);
        }while(count<200);
        return foundElement.y * 100 + foundElement.x;
    }

};

function calcAngleDegrees(x, y) {
    return ((Math.atan2(y, x) * -180 / Math.PI) + 180 + 270) %360;
}

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => new InputRow(row));
}
function day(file){
    new Day10(fileInput(file));
}

day('data.input');
// day('data_test.input');
// day('data_test2.input');
// day('data_test3.input');
// day('data_test4.input');
// day('data_test5.input');
// day('data_test6.input');

/* console.log(calcAngleDegrees(0,1));
console.log(calcAngleDegrees(1,1));
console.log(calcAngleDegrees(1,0));
console.log(calcAngleDegrees(1,-1));
console.log(calcAngleDegrees(0,-1));
console.log(calcAngleDegrees(-1,-1));
console.log(calcAngleDegrees(-1,0));
console.log(calcAngleDegrees(-1,1)); */
/* console.log(calcAngleDegrees(0,2));
console.log(calcAngleDegrees(1,3));
console.log(calcAngleDegrees(1,2));
console.log(calcAngleDegrees(2,3));
console.log(calcAngleDegrees(1,1));
console.log(calcAngleDegrees(3,2));
console.log(calcAngleDegrees(4,2));
console.log(calcAngleDegrees(3,1));
console.log(calcAngleDegrees(7,2)); */
