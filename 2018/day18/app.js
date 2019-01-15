const fs = require('fs')
const path = require('path')

class Day {
    constructor(matrix, size) {
        this.matrix = matrix;
        this.size = size;
        // console.log(this.part1(10));
        console.log(this.part2());
    }

    part1(time) {
        for(let i=0;i<time;i++){
            this.oneStep();
            // this.printMatrix();
        }
        return this.count('#') * this.count('|');
    }
    count(search){
        return this.matrix.map(row=>
            row.filter(el=>el==search).length
        ).reduce((sum,current)=>sum+=current,0);
    }
    oneStep(){
        const newMatrix = this.createEmptyMatrix();
        
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let current = this.matrix[y][x];
                if (current == '.') {
                    newMatrix[y][x] = this.getAdjacents(y, x)
                        .filter(el=>el=='|')
                        .length >=3 ? '|' : '.';
                } else if (current == '|') {
                    newMatrix[y][x] = this.getAdjacents(y, x)
                        .filter(el => el == '#')
                        .length >= 3 ? '#' : '|';
                } else if (current == '#') {
                    const adjacents = this.getAdjacents(y, x);
                    newMatrix[y][x] = (adjacents.filter(el => el == '#').length >= 1 && adjacents.filter(el => el == '|').length >= 1) ? '#':'.';
                }
            }
        }
        this.matrix = newMatrix;
    }
    createEmptyMatrix(){
        const matrix = [];
        for (let y = 0; y < this.size; y++) {
            matrix[y]=[];
        }
        return matrix;
    }
    getAdjacents(y,x){
        const adjacents = [];
        if (y - 1 >= 0 && x - 1 >= 0) adjacents.push(this.matrix[y-1][x-1]);
        if (y - 1 >= 0) adjacents.push(this.matrix[y-1][x]);
        if (y - 1 >= 0 && x + 1 < this.size) adjacents.push(this.matrix[y-1][x+1]);
        if (x - 1 >= 0) adjacents.push(this.matrix[y][x-1]);
        if (x + 1 < this.size) adjacents.push(this.matrix[y][x+1]);
        if (y + 1 < this.size && x - 1 >= 0) adjacents.push(this.matrix[y + 1][x - 1]);
        if (y + 1 < this.size) adjacents.push(this.matrix[y + 1][x]);
        if (y + 1 < this.size && x + 1 < this.size) adjacents.push(this.matrix[y + 1][x + 1]);
        return adjacents;
    }

    executeOneBilion() {
        this.history = [];
        let i = 0;
        let ix;
        for (i = 0; i < 1000000000; i++) {
            const count1 = this.count('#');
            const count2 = this.count('|');
            const count = count1 * count2;
            let found = this.history.find(
                (el,index)=>el==JSON.stringify(this.matrix)
            );
            if(found){
                ix = this.history.indexOf(found);
                // console.log("ix:" + ix)
                break;
            }
            this.history.push(JSON.stringify(this.matrix));
            this.oneStep();
            // this.printMatrix();
        }
        // console.log("i:"+i);
        const sameAsBilion = (ix + (1000000000 - ix) % (i - ix));
        console.log("same as bilion:" + sameAsBilion);
        const m = this.history[sameAsBilion];
        return [...m].filter(el => el == '#').length * [...m].filter(el => el == '|').length;
    }

    part2() {
        // console.log(this.part1(201))
        // console.log(this.part1(146)) //163868
        // console.log(this.part1(202)) //163868
        // console.log(this.part1(257)) //174935
        // console.log(this.part1(258)) //176660
        // console.log(this.part1(259)) //181744
        // console.log(this.part1(260)) //186277
        // console.log(this.part1(8000)) //199064
        // console.log(this.part1(10000)) //176900
        // console.log(this.part1(417)) //174028
        // console.log(this.part1(445)) //174028
        // console.log(this.part1(445 + (445 - 417))) //174028
        // console.log(this.part1(440)) //174028
        return this.executeOneBilion();
    }

    printMatrix() {
        let data = this.matrix
            .map(row => row
                .join('')
            ).join('\n');
        console.log(data);
    }
    writeMatrix() {
        const file = path.join(__dirname, 'result.txt');
        let data = this.matrix
            .map(row => row
                .join('')
            ).join('\n');
        fs.writeFileSync(file, data, { encoding: 'utf-8' })
    }
};

function fileInput(fileName){
    const file = path.join(__dirname, fileName)
    return fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n')
        .map(row => [...row]);
}
function day(file, size){
    new Day(fileInput(file), size);
}

// day('data2.input', 10);
day('data.input', 50);
