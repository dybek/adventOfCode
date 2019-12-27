const fs = require('fs')
const path = require('path')

class InputRow {
    constructor(row) {
        this.program = row.split(',')
            .map(intcode => parseInt(intcode));
    }
}

const permutations = function* (elements) {
    if (elements.length === 1) {
        yield elements;
    } else {
        let [first, ...rest] = elements;
        for (let perm of permutations(rest)) {
            for (let i = 0; i < elements.length; i++) {
                let start = perm.slice(0, i);
                let rest = perm.slice(i);
                yield [...start, first, ...rest];
            }
        }
    }
}

class Program {
    constructor(program) {
        this.program = program;
        this.halt = false;
        this.phaseUsed = false;
        this.ip = 0;
        this.relativeBase = 0;
        const code = this.program[this.ip++];
        this.instruction = this.decodeInstruction(code);
    }

    size() {
        return this.program.length;
    }

    execute(input, phase) {
        this.input = input;
        this.phase = phase;
        
        this.output = null;
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
                    console.log(this.output);
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
                    return '\n'; //this.output;
                    break;
                default:
                    console.error("Error")
            }
            this.instruction = this.decodeInstruction(this.program[this.ip++])
        } while (true);
        // this.halt = true;
        return this.output;
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

class Day9 {

    constructor(dayInput) {
        this.instructionSet = dayInput.program;
    
        // console.log(this.part1(1));
        console.log(this.part2(2));
    }

    part1(input) {

        const program1 = new Program([...this.instructionSet]);
        let output = program1.execute(input, input);
        return output;
    }


    part2() {
        return this.part1(2);
    }

};

function fileInput(fileName) {
    const file = path.join(__dirname, fileName)
    return new InputRow(fs.readFileSync(file, { encoding: 'utf-8' }));
}
function day(file){
    new Day9(fileInput(file));
}

// day('data_test.input');
// day('data_test2.input');
// day('data_test3.input');
day('data.input');
