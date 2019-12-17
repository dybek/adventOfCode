const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

class Day5 {
    constructor(dayInput) {
        this.program = dayInput.program;
        console.log(this.part1(1));
        // console.log(this.part2(19690720));
    }
    size() {
        return this.program.length;
    }

    part1(input) {
        this.input = input;
        this.output = null;

        this.parameterMode = 0;
        let ip = 0;
        let code = this.program[ip++];
        let instruction = this.decodeInstruction(code);
        
        do {
            switch (instruction.opcode){
                case 1:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument % this.size(), instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument % this.size(), instruction.modes[1]);
                    let sum = firstParam + secondParam;
                    this.program[thirdArgument % this.size()] = sum;
                    break;
                }
                case 2:{
                    let firstArgument = this.program[ip++];
                    let secondArgument = this.program[ip++];
                    let thirdArgument = this.program[ip++];
                    let firstParam = this.readValue(firstArgument % this.size(), instruction.modes[0]);
                    let secondParam = this.readValue(secondArgument % this.size(), instruction.modes[1]);
                    let result = firstParam * secondParam;
                    this.program[thirdArgument % this.size()] = result;
                }
                case 3:{
                    let argumentIndex = this.program[ip++];
                    this.program[argumentIndex]=this.input;
                    break;
                }
                case 4:{
                    let argumentIndex = this.program[ip++];
                    this.output = this.program[argumentIndex];
                    break;
                }
                case 99:
                    return this.output;
                    break;
                default:
                    console.error("Error")
            }
            instruction = this.decodeInstruction(this.program[ip++])
        } while (ip < this.size());
        return this.output;
    }

    decodeInstruction(code){
        const stringCode = code.toString();
        const opcode = code % 100;
        const modes = new Array(3)
        modes[0] = stringCode.length > 2 ? parseInt(stringCode[2]) : 0;
        modes[1] = stringCode.length > 3 ? parseInt(stringCode[3]) : 0;
        modes[2] = stringCode.length > 4 ? parseInt(stringCode[4]) : 0;
        return{
            opcode,
            modes
        }
    }

    readValue(parameter, parameterMode){
        if(parameterMode === 0){
            return this.program[parameter];
        }else if(parameterMode === 1) { 
            return parameter;
        }
    }

    part2(condition) {
        const savedProgram = [...this.program];
        for (let i = 0; i <= 99; i++) {
            for (let j = 0; j <= 99; j++) {
                this.program = [...savedProgram];
                let result = this.part1(i, j);
                if (result == condition) return 100 * i + j;
            }
        }

        return -1;
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file) {
    new Day5(fileInput(file));
}

// day('data_test.input');
day('data.input');
