const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

class Program {
    constructor(program) {
        this.program = program;
        this.halt = false;

        this.input = null;
        this.output = null;

        this.ip = 0;
        this.relativeBase = 0;
        const code = this.program[this.ip++];
        this.instruction = this.decodeInstruction(code);
    }

    size() {
        return this.program.length;
    }

    *execute() {
        
        // this.output = null;
        // if(this.ip >= this.size()){
            // this.ip = 0;
            // this.instruction = this.decodeInstruction(this.program[this.ip++]);
        // }

        do {
            switch (this.instruction.opcode) {
                case 1: {//sum
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);
                    let sum = firstParam + secondParam;
                    this.writeValue(thirdArgument, this.instruction.modes[2], sum);
                    break;
                }
                case 2: {//multiple
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);
                    let result = firstParam * secondParam;
                    this.writeValue(thirdArgument, this.instruction.modes[2], result);
                    break;
                }
                case 3: {//read input
                    let argumentIndex = this.program[this.ip++];
                    
                    this.writeValue(argumentIndex, this.instruction.modes[0], this.input);
                    // this.program[argumentIndex] = this.input;
                    
                    break;
                }
                case 4: {// write output
                    let argumentIndex = this.program[this.ip++];
                    this.output = this.readValue(argumentIndex, this.instruction.modes[0]);
                    //to correct run after return
                    // this.instruction = this.decodeInstruction(this.program[this.ip++]);
                    // return this.output;
                    // console.log(this.output);
                    yield this.output;
                    break;
                }
                case 5: {//jump if true
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    if (firstParam != 0) {
                        this.ip = secondParam;
                    }
                    break;
                }
                case 6: {//jump if false
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    if (firstParam == 0) {
                        this.ip = secondParam;
                    }
                    break;
                }
                case 7: {//less than
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    let result = (firstParam < secondParam) ? 1 : 0;
                    this.writeValue(thirdArgument, this.instruction.modes[2], result);
                    break;
                }
                case 8: {//equals
                    let firstArgument = this.program[this.ip++];
                    let secondArgument = this.program[this.ip++];
                    let thirdArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument, this.instruction.modes[1]);

                    let result = (firstParam == secondParam) ? 1 : 0;

                    this.writeValue(thirdArgument, this.instruction.modes[2], result);
                    break;
                }
                case 9: { //set relative base
                    let firstArgument = this.program[this.ip++];
                    let firstParam = this.readValue(firstArgument, this.instruction.modes[0]);
                    this.relativeBase +=firstParam;
                    break;
                }
                case 99: //halt
                    this.halt = true;
                    return this.halt;
                    break;
                default:
                    console.error("Error")
            }
            this.instruction = this.decodeInstruction(this.program[this.ip++])
        } while (this.halt != true);
        // this.halt = true;
        // return this.output;
    }

    decodeInstruction(code) {
        const opcode = code % 100;
        const modes = new Array(3);
        modes[0] = Math.floor(code / 100) % 10; //stringCode.length > 2 ? parseInt(stringCode[2]) : 0;
        modes[1] = Math.floor(code / 1000) % 10; //stringCode.length > 3 ? parseInt(stringCode[3]) : 0;
        modes[2] = Math.floor(code / 10000) % 10; //stringCode.length > 4 ? parseInt(stringCode[4]) : 0;
        return {
            opcode,
            modes
        }
    }

    readValue(parameter, parameterMode) {
        if (parameterMode === 0) {
            let value = this.program[parameter];
            if(isNaN(value)){
                // this.program[parameter] = 0;
                return 0;
            }else{
                return value;
            }
        } else if (parameterMode === 1) {
            return parameter;
        } else if (parameterMode === 2) {
            let value = this.program[this.relativeBase + parameter];
            if (isNaN(value)) {
                // this.program[parameter] = 0;
                return 0;
            } else {
                return value;
            }
            // return parameter;
        }
    }

    writeValue(parameter, parameterMode, value) {
        if (parameterMode === 0) {
            this.program[parameter] = value;
        } else if (parameterMode === 1) {
            console.error('make no sense');
        } else if (parameterMode === 2) {
            this.program[this.relativeBase + parameter] = value;
        }
    }

};

class Matrix{
    constructor(size){
        this.size = size;
        this.matrix = this.createMatrix(size);
    }
    
    createMatrix(size) {
        const matrix = [];
        for (let y = 0; y < size; y++) {
            matrix[y] = [];
            for (let x = 0; x < size; x++) {
                matrix[y][x] = 0
            }
        }
        return matrix;
    }

    get(position){
        return this.matrix[position.x][position.y];
    }
    set(position, value){
        this.matrix[position.x][position.y] = value;
    }
    count(value){
        let count = this.matrix.reduce(
            (prev, current)=> prev += current.filter(element=>element==value).length, 0);
        return count;
        /* for (let y = 0; y < this.matrix; y++) {
            let row = this.matrix[y];
            for (let x = 0; x < row.length; x++) {
                row[x] = 0
            }
        } */
    }
    printMatrix() {
        /*  const tempMatrix = [];
         const firstElement = matrix[0];
 
         for (let y = 0; y < firstElement.length; y++) {
             tempMatrix[y]=[];
             for (let x = 0; x < matrix.length; x++) {
                 tempMatrix[y][x] = matrix[x][y];
             } 
 
         } */
        this.matrix.forEach(line => console.log(
            line.map(el => el == 1 ? '#' : ' ')
                .join('')
        ));
    }
}

const size = 45;
class Day11 {

    constructor(dayInput) {
        this.instructionSet = dayInput.program;
    
        // console.log(this.part1());
        console.log(this.part2());
    }

    

    part1() {
       
        let matrix = new Matrix(size);
        const program = new Program([...this.instructionSet]);
        let executor = program.execute();
        let x
        let y
        let id
        do{
            x = executor.next();
            y = executor.next();
            id = executor.next();
            if (x.done && y.done && id.done) break;
            matrix.set({ x: x.value, y: y.value }, id.value);

        }while(true);

        return matrix.count(2);
    }


    part2() {
        let matrix = new Matrix(size);
        let instructions = [...this.instructionSet];
        instructions[0] = 2;
        const program = new Program([...instructions]);
        let executor = program.execute();
        let x
        let y
        let id //3-padle, 4-ball
        let padleX
        let ballX
        let score
        do {
            x = executor.next();
            y = executor.next();
            id = executor.next();
            if (x.done && y.done && id.done) break;
            if(x.value == -1 && y.value ==0){
                score = id.value;
            }else{
                if(id.value == 3){
                    padleX = x.value
                }
                if (id.value == 4) {
                    ballX = x.value
                }
                if(ballX<padleX){
                    program.input = -1;
                } else if (ballX > padleX) {
                    program.input = 1;
                }else{
                    program.input = 0;
                }
                matrix.set({ x: x.value, y: y.value }, id.value);
            }

        } while (true);

        return score;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file){
    new Day11(fileInput(file));
}

// day('data_test.input');
// day('data_test2.input');
// day('data_test3.input');
day('data.input');
