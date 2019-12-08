const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(rows) {
        this.instructions = rows.map(row => 
            row.split(',').map(instructionText => {
                return {
                    direction: instructionText[0],
                    steps: parseInt(instructionText.substring(1))
                }
            })
        );
        let counter = {
            'L':0,
            'R':0,
            'U':0,
            'D':0,
        }
        this.instructions[0].forEach(instruction=>{
            counter[instruction.direction]+=instruction.steps;
        });
    }
}

class Day3 {
    constructor(dayInput) {
        this.instructions = dayInput.instructions;
        this.maxSize = 30000;
        // console.log(this.part1());
        console.log(this.part2());
    }

    drawFromPoint(instruction){
        let {direction, steps} = instruction;
        const points = [];
        let point;
        let { x, y } = this.point;
        switch(direction){
            case 'U':

                for(let k=y;k>=(y-steps);k--){
                    point = this.makePoint(x, k);
                    this.move(point);
                    if(k!=y)points.push(point);
                }
                break;
            case 'D':
                for (let k = y; k <= (y + steps); k++) {
                    point = this.makePoint(x, k);
                    this.move(point);
                    if (k != y)points.push(point);
                }
                break;
            case 'L':
                for (let k = x; k >= (x - steps); k--) {
                    point = this.makePoint(k, y);
                    this.move(point);
                    if (k != x)points.push(point);
                }
                break;
            case 'R':
                for (let k = x; k <= (x + steps); k++) {
                    point = this.makePoint(k, y);
                    this.move(point);
                    if (k != x)points.push(point);
                }
                break;
        }
        return points;
    }
    move(point){
        this.point = point;
    }

    makePoint(x,y){
        return {x,y};
    }

    part1() {

        let firstPoints = [];
        this.point = { x: 0, y: 0 };
        this.instructions[0].forEach(instruction=>{
            const points = this.drawFromPoint(instruction);
            firstPoints.push(...points)
        });

        let secondPoints = [];
        this.point = { x: 0, y: 0 };
        this.instructions[1].forEach(instruction => {
            const points = this.drawFromPoint(instruction);
            secondPoints.push(...points)
        });

        let distance = 0;
        let min = this.maxSize;
        for (let i = 1; i < firstPoints.length; i++) {
            for (let j = 1; j < secondPoints.length; j++) {

                if ((firstPoints[i].x == secondPoints[j].x) && firstPoints[i].y == secondPoints[j].y){
                    distance = Math.abs(firstPoints[i].x) + Math.abs(firstPoints[i].y);
                    if(distance < min) {
                        min = distance;
                    }
                }

            }
        }

        return min;
    }


    part2() {
        let firstPoints = [];
        this.point = { x: 0, y: 0 };
        this.instructions[0].forEach(instruction => {
            const points = this.drawFromPoint(instruction);
            firstPoints.push(...points)
        });

        let secondPoints = [];
        this.point = { x: 0, y: 0 };
        this.instructions[1].forEach(instruction => {
            const points = this.drawFromPoint(instruction);
            secondPoints.push(...points)
        });

        let distance = 0;
        let min = 10000000;
        for (let i = 0; i < firstPoints.length; i++) {
            for (let j = 0; j < secondPoints.length; j++) {

                if ((firstPoints[i].x == secondPoints[j].x) && firstPoints[i].y == secondPoints[j].y) {
                    // console.log(firstPoints[i], secondPoints[j]);
                    distance = i + j + 2;
                    if (distance < min) {
                        min = distance;
                    }
                }

            }
        }

        return min;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    const rows = fs.readFileSync(file, { encoding: 'utf-8' })
        .split('\n');
    return new InputRow(rows);
}
function day(file) {
    new Day3(fileInput(file));
}

day('data_test1.input');
day('data_test2.input');
day('data_test3.input');
day('data_test4.input');
day('data_test5.input');
day('data_test6.input');
day('data.input');
